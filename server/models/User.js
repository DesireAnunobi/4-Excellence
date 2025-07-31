const bcrypt = require('bcrypt');
const db = require('../db/connect');

// Base User class with common functionality
class User {
    constructor(data) {
        this.user_id = data.user_id;
        this.username = data.username;
        this.password_hash = data.password_hash;
        this.is_teacher = data.is_teacher;
    }

    // // Common methods all users can use
    // async verifyPassword(plainPassword) {
    //     return await bcrypt.compare(plainPassword, this.password_hash);
    // }

    // Static method to create appropriate user type

    static async isTeacher(teacherID) {
        const result = await db.query(
            "SELECT is_teacher FROM Users WHERE user_id = $1",
            [teacherID]
        );

        if (result.rows.length === 0) {
            throw new Error("User not found");
        }

        return result.rows[0].is_teacher === true;
    }

    static async getUserInfo(userID) {
        if (!userID) {
            throw new Error('Valid UserID is required');
        }

        try {
            const result = await db.query(
                "SELECT username , is_teacher FROM Users WHERE user_id = $1",
                [userID]
            );

            if (result.rows.length > 0) {
                return result.rows;
            } else {
                return "No Results"; // Return empty array if no stats found
            }
        } catch (error) {
            throw new Error('Failed to find user stats: ' + error.message);
        }
    }


    static async createUser(data) {
        // Sign Up function that takes in data and based on the is_teacher conditon, it additionally adds the user to the Teachers table or the Students table 
        // passoword hashing is done by bcrypt
        const username = data.username?.trim(); // Note: Using userName from data but query checks 'username'
        const password = data.password?.trim();
        const is_teacher = Boolean(data.is_teacher);
        const school_name = data.school_name?.trim();

        // Validate required fields
        if (!username || username.length === 0) {
            throw new Error('Username is required');
        }

        if (!password || password.length === 0) {
            throw new Error('Password is required');
        }

        // Teachers require school name
        if (is_teacher && (!school_name || school_name.length === 0)) {
            throw new Error('School name is required for teachers');
        }

        // Check for existing user (case-sensitive)
        const existingUser = await db.query(
            "SELECT * FROM Users WHERE username = $1",
            [username] // Using the trimmed username
        );

        if (existingUser.rows.length > 0) {
            throw new Error('Username already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            // Create user
            const result = await db.query(
                "INSERT INTO Users (username, password_hash, is_teacher) VALUES ($1, $2, $3) RETURNING *",
                [username, hashedPassword, is_teacher]
            );
            const newUser = result.rows[0];

            // Create student/teacher record
            if (!is_teacher) {
                const studentResult = await db.query(
                    "INSERT INTO Students (user_id) VALUES ($1) RETURNING *",
                    [newUser.user_id]
                );
                const gameStats = await db.query(
                    "INSERT INTO Student_Stats (student_id, game_id) VALUES ($1, 1), ($2, 2) RETURNING *",
                    [studentResult.rows[0].student_id, studentResult.rows[0].student_id]
                );
                return new Student({
                    ...newUser,
                    student_id: studentResult.rows[0].student_id
                });
            } else {
                const teacherResult = await db.query(
                    "INSERT INTO Teachers (user_id, school_name) VALUES ($1, $2) RETURNING *",
                    [newUser.user_id, school_name] // Using trimmed school_name
                );
                return new Teacher({
                    ...newUser,
                    teacher_id: teacherResult.rows[0].teacher_id,
                    school_name: teacherResult.rows[0].school_name
                });
            }
        } catch (error) {
            console.error('Sign-up Error:', error);
            throw new Error('Account creation failed. Please try again.');
        }
    }

    static async CheckUserExists(username, password, is_teacher) {
        // "isMatch" variable identifies if login was successful based on boolean output: (TRUE = successful) & (False = unsuccessful) 
        try {
            // Find user by username
            const result = await db.query("SELECT * FROM Users WHERE username = $1", [username]);
            if (result.rows.length === 0) {
                // User not found
                return false;
            }
            const user = result.rows[0];

            // Authorisation Check
            if (user.is_teacher != is_teacher) {
                throw new Error('Failed to pass authorisation check');
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password_hash);
            return {success: isMatch, username: user.username, user_id: user.user_id}; // true if match, false otherwise
        } catch (error) {
            // Log error if needed
            return false;
        }
    }


    static async deleteUser(username) {
        if (!username || typeof username !== 'string') {
            console.log(username)
            throw new Error('Valid username is required');
        }

        try {
            const cleanUsername = username.trim().replace(/\s+/g, '').toLowerCase();
        
            const result = await db.query(
                `DELETE FROM Users 
                 WHERE LOWER(REPLACE(username, '_', '')) = $1 
                 RETURNING username, user_id, is_teacher`,
                [cleanUsername]
            );

            // Return null if no user found 
            if (result.rows.length === 0) {
                return null;
            }

            // Return the full deleted user data
            return result.rows[0];

        } catch (error) {
            throw new Error(`User deletion failed: ${error.message}`);
        }
    }

    static async getStudentsInClass(classID = null) {
        try {
            let query;
            let params = [];

            if (classID) {
                // Get students for a specific class
                query = `
                    SELECT 
                        c.class_name,
                        u.username AS student_name
                    FROM Classes c
                    JOIN Students_To_Classes stc ON c.class_id = stc.class_id
                    JOIN Students s ON stc.student_id = s.student_id
                    JOIN Users u ON s.user_id = u.user_id
                    WHERE c.class_id = $1
                    ORDER BY u.username
                `;
                params = [classID];

                const result = await db.query(query, params);

                if (result.rows.length === 0) {
                    return {};
                }

                const className = result.rows[0].class_name;
                const studentsNames = result.rows.map(row => row.student_name);

                return {
                    class_name: className,
                    students_names: studentsNames
                };
            } else {
                // Get students for all classes
                query = `
                    SELECT 
                        c.class_name,
                        s.student_id,
                        u.username AS student_name,
                        u.user_id
                    FROM Classes c
                    JOIN Students_To_Classes stc ON c.class_id = stc.class_id
                    JOIN Students s ON stc.student_id = s.student_id
                    JOIN Users u ON s.user_id = u.user_id
                    ORDER BY c.class_name, u.username
                `;

                const result = await db.query(query);

                if (result.rows.length === 0) {
                    return {};
                }

                // Group students by class name
                const classesWithStudents = {};

                result.rows.forEach(row => {
                    const className = row.class_name;

                    if (!classesWithStudents[className]) {
                        classesWithStudents[className] = [];
                    }

                    classesWithStudents[className].push({
                        student_id: row.student_id,
                        student_name: row.student_name,
                        user_id: row.user_id
                    });
                });

                return classesWithStudents;
            }

        } catch (error) {
            throw new Error('Failed to get students in classes: ' + error.message);
        }
    }





}

// Student class - inherits from User
class Student extends User {
    constructor(data) {
        super(data);
        this.student_id = data.student_id;
        this.role = 'student';
    }

    static async getUserStats(student_id) {
        if (!student_id) {
            throw new Error('Valid Student ID is required');
        }

        try {
            const result = await db.query(
                "SELECT * FROM Student_Stats WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1)",
                [student_id]
            );

            if (result.rows.length > 0) {
                return result.rows;
            } else {
                return "No Results"; // Return empty array if no stats found
            }
        } catch (error) {
            throw new Error('Failed to find user stats: ' + error.message);
        }
    }

    // 


}

// Teacher class - inherits from User
class Teacher extends User {
    constructor(data) {
        super(data);
        this.teacher_id = data.teacher_id;
        this.school_name = data.school_name;
        this.role = 'teacher';
    }


    static async getClassByTeacher(userID) {
        try {
            const isTeacher = await super.isTeacher(userID);

            if (!isTeacher) {
                throw new Error("Elevation of privileges attempt!");
            }

            const result = await db.query(
                "SELECT class_name FROM classes WHERE teacher_id = (SELECT teacher_id FROM teachers WHERE user_id = $1)",
                [userID]
            );

            return result.rows.length > 0 ? result.rows : "No Results";
        } catch (error) {
            throw new Error('Failed to get classes: ' + error.message);
        }

    }

    static async getClasses(classID, teacherID) {
        try {
            const isTeacher = await super.isTeacher(teacherID);

            if (!isTeacher) {
                console.log("Elevation of privileges attempt!");
                return null;
            }

            const result = await db.query(
                "SELECT class_name FROM classes WHERE class_id = $1", [classID]
            );
            console.log(result.rows)

            return result.rows.length > 0 ? result.rows : "No Results"; //if statement
        } catch (error) {
            throw new Error('Failed to get classes: ' + error.message);
        }

    }

    static async getAllClasses(teacherID) {
        try {
            const isTeacher = await super.isTeacher(teacherID);

            if (!isTeacher) {
                console.log("Elevation of privileges attempt!");
                return null;
            }

            const result = await db.query(
                "SELECT class_name FROM classes "
            );
            console.log(result.rows)

            return result.rows.length > 0 ? result.rows : "No Results";
        } catch (error) {
            throw new Error('Failed to get classes: ' + error.message);
        }

    }

    static async deleteClass(teacherID, classID) {
        try {
            const isTeacher = await super.isTeacher(teacherID);

            if (!isTeacher) {
                console.log("Elevation of privileges attempt!");
                return null;
            }


            // verify the teacher owns the class
            const ownershipCheck = await db.query(
                `SELECT 1 FROM Classes WHERE class_id = $1 AND teacher_id = (SELECT teacher_id FROM teachers WHERE user_id = $2)`,
                [classID, teacherID]
            );
    
            if (ownershipCheck.rows.length === 0) {
                return { success: false, message: "Class not found or unauthorised" };
            }
    
            //Delete the class
            const result = await db.query(
                `DELETE FROM Classes WHERE class_id = $1 RETURNING class_id, class_name`, [classID]
            );
    
            return { 
                success: true,
                deletedClass: result.rows[0] 
            };
    
        } catch (error) {
            console.error("error:", error);
            return { 
                success: false, 
                message: "Failed to delete class" 
            };
        }
    }


    // use a toggle list / or list subject options e.g. maths,english... and when user selects it the db queries for the associated subject id 
    static async createClass(userID, className, subjectChoice) {
        try {
            // Verify teacher exists
            const teacher = await db.query(
                `SELECT teacher_id FROM teachers WHERE user_id = $1`, 
                [userID]
            );
            
            if (!teacher.rows.length) {
                throw new Error("Teacher not found");
            }

            const classExists = await db.query(
                `SELECT 1 FROM classes 
                 WHERE class_name = $1 
                 AND teacher_id = $2`,
                [className, teacher.rows[0].teacher_id]
            );
            
            if (classExists.rows.length) {
                throw new Error(`Class "${className}" already exists for this teacher`);
            }
    
            // Takes the subjectID and  
            const subjectResult = await db.query(
                `SELECT subject_id FROM subjects WHERE subject LIKE $1 || '%' LIMIT 1`, [subjectChoice.trim()]
                // not case sensitve due to ILIKE
            );
            if (!subjectResult.rows.length) {
                throw new Error(`Subject "${subjectChoice}" not found`);
            }
            
            const subjectId = subjectResult.rows[0].subject_id; // Extract the ID

            // Creates the class using the subjectId from the inputted subject name
            const { rows: [newClass] } = await db.query(
                `INSERT INTO classes (class_name, teacher_id, subject_id) VALUES ($1, $2, $3) RETURNING class_id, class_name, subject_id`, [className, teacher.rows[0].teacher_id, subjectId] // Use the extracted number
            );
            return newClass;
    
        } catch (error) {
            console.error("Class creation failed:", error);
            throw error;
        }
    }

    static async updateClass(teacherId, classId, className) {
        console.log('class name change: ', className)
        console.log('teacher ID:', teacherId)
        console.log('class ID:', classId)
        const { rows: [classData] } = await db.query(
            `UPDATE Classes SET class_name = $1 WHERE class_id = $2 AND teacher_id = (SELECT teacher_id FROM Teachers WHERE user_id = $3) RETURNING class_id, class_name`, [className, classId, teacherId]
        );
        console.log('class data:', classData)
        if (!classData) {
            throw new Error("Class not found or unauthorised");
        }
    
        return classData;
    }
    



}

module.exports = { User, Student, Teacher };