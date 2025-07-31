const {User, Student, Teacher} = require('../../../server/models/User.js');

jest.mock('../../../server/db/connect.js', () => ({
  query: jest.fn(),
  end: jest.fn()
}));

const db = require("../../../server/db/connect.js");

jest.mock('bcrypt');
const bcrypt = require('bcrypt');

describe('User', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('isTeacher', () => {
        it('returns true', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ is_teacher: true }] });

            const result = await User.isTeacher(2);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(result).toEqual(true);
        });

        it('throws error if user is not found', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            await expect(User.isTeacher(2)).rejects.toThrow("User not found");

            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('createUser', () => {
        it('should create a new student successfully', async () => {
            db.query.mockResolvedValueOnce({ rows: [] }) // no existing user
            db.query.mockResolvedValueOnce({ rows: [{ user_id: 1, username: 'student1', password_hash: 'hashedpassword', is_teacher: false }] }) // new user inserted
            db.query.mockResolvedValueOnce({ rows: [{ student_id: 10 }] }) // student inserted
            db.query.mockResolvedValueOnce({ rows: [{}, {}] }); // student stats inserted

            bcrypt.hash.mockResolvedValue('hashedpassword');

            const user = await User.createUser({
                username: 'student1',
                password: 'password123',
                is_teacher: false
            });

            expect(user).toEqual(new Student({
                user_id: 1,
                username: 'student1',
                password_hash: 'hashedpassword',
                is_teacher: false,
                student_id: 10
            }));

            expect(db.query).toHaveBeenCalledTimes(4);
        });

        it('should create a new teacher successfully', async () => {
            db.query.mockResolvedValueOnce({ rows: [] }) // no existing user
            db.query.mockResolvedValueOnce({ rows: [{ user_id: 1, username: 'teacher1', password_hash: 'hashedpassword', is_teacher: true }] }) // new user inserted
            db.query.mockResolvedValueOnce({ rows: [{ teacher_id: 10, school_name: 'xxx' }] }) // student inserted

            bcrypt.hash.mockResolvedValue('hashedpassword');

            const user = await User.createUser({
                username: 'teacher1',
                password: 'password123',
                is_teacher: true,
                school_name: 'xxx'
            });

            expect(user).toEqual(new Teacher({
                user_id: 1,
                username: 'teacher1',
                password_hash: 'hashedpassword',
                is_teacher: true,
                teacher_id: 10,
                school_name: 'xxx'
            }));

            expect(db.query).toHaveBeenCalledTimes(3);
        });

        it('throws error if no username', async () => {
            await expect(
                User.createUser({username: '', password: 'password123', is_teacher: true, school_name: 'xxx'})
            ).rejects.toThrow('Username is required');
        });

        it('throws error if no password', async () => {
            await expect(
                User.createUser({username: 'teacher1', password: '', is_teacher: true, school_name: 'xxx'})
            ).rejects.toThrow('Password is required');
        });

        it('throws error if teacher is true and no school', async () => {
            await expect(
                User.createUser({username: 'teacher1', password: 'password123', is_teacher: true, school_name: ''})
            ).rejects.toThrow('School name is required for teachers');
        });

        it('throws error if user already exists', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ user_id: 1, username: 'teacher1', password_hash: 'hashedpassword', is_teacher: true }] }) // existing user

            await expect(
                User.createUser({username: 'teacher1', password: 'password123', is_teacher: true, school_name: 'xxx'})
            ).rejects.toThrow('Username already exists');

            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('CheckUserExists', () => {
        it('should return success true with correct credentials', async () => {
            const mockUser = {
                username: 'testuser',
                user_id: 1,
                password_hash: 'hashedpassword',
                is_teacher: true
            };

            db.query.mockResolvedValue({ rows: [mockUser] });
            bcrypt.compare.mockResolvedValue(true);

            const result = await User.CheckUserExists('testuser', 'password', true);
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM Users WHERE username = $1", ['testuser']);
            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
            expect(result).toEqual({ success: true, username: 'testuser', user_id: 1 });
        });

        test('should return false if user is not found', async () => {
            db.query.mockResolvedValue({ rows: [] });

            const result = await User.CheckUserExists('unknown', 'password', false);

            expect(result).toBe(false);
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('should throw authorisation error if is_teacher does not match expected value', async () => {
            const mockUser = {
                username: 'testuser',
                user_id: 1,
                password_hash: 'hashedpassword',
                is_teacher: false
            };

            db.query.mockResolvedValue({ rows: [mockUser] });

            const result = await User.CheckUserExists('testuser', 'password', true);

            expect(result).toBe(false);
        });

        test('should return false if password is incorrect', async () => {
            const mockUser = {
                user_id: 3,
                username: 'student1',
                password_hash: 'wronghash',
                is_teacher: false
            };

            db.query.mockResolvedValue({ rows: [mockUser] });
            bcrypt.compare.mockResolvedValue(false);

            const result = await User.CheckUserExists('student1', 'wrongpassword', false);

            expect(result).toEqual({ success: false, username: 'student1', user_id: 3 });
        });
    });
});

describe('Student', () => {
    describe('getUserStats', () => {
        it('returns user statistics', async () => {
            db.query.mockResolvedValue({ rows: [{student_id: 1, game_id: 1, times_played: 2, avg_score: 8, best_score: 10, last_score: 6}] });

            const result = await Student.getUserStats(1);

            expect(result).toEqual([{"avg_score": 8, "best_score": 10, "game_id": 1, "last_score": 6, "student_id": 1, "times_played": 2}]);
        });

        it('throw error if studentID not received', async () => {
            await expect(
                Student.getUserStats()
            ).rejects.toThrow('Valid Student ID is required');
        })

        it('returns "No results" no user entries are found', async () => {
            db.query.mockResolvedValue({ rows: [] });

            const result = await Student.getUserStats(3);

            expect(result).toEqual("No Results");
        });
    });
});

describe('Teacher', () => {
    describe('getClassByTeacher', () => {
        it('should return class rows if teacher and classes exist', async () => {
            jest.spyOn(User, 'isTeacher').mockResolvedValue(true);

            db.query.mockResolvedValue({
                rows: [{ class_name: 'Class 9A' }, { class_name: 'Class 10A' }]
            });

            const result = await Teacher.getClassByTeacher(1);

            expect(result).toEqual([{ class_name: 'Class 9A' }, { class_name: 'Class 10A' }]);

            expect(User.isTeacher).toHaveBeenCalledWith(1);
        });

        it('throws error if user is not a teacher', async () => {
            jest.spyOn(User, 'isTeacher').mockResolvedValue(false);

            await expect(Teacher.getClassByTeacher(2)).rejects.toThrow("Elevation of privileges attempt!");
        });

        it('should return "No Results" if teacher has no classes', async () => {
            jest.spyOn(User, 'isTeacher').mockResolvedValue(true);

            db.query.mockResolvedValue({ rows: [] });

            const result = await Teacher.getClassByTeacher(1);
            expect(result).toBe("No Results");
        });
    });

    describe('createClass', () => {
        it('should create a class', async () => {
            db.query.mockResolvedValueOnce({rows: [{ teacher_id: 1 }]});
            db.query.mockResolvedValueOnce({rows: []});
            db.query.mockResolvedValueOnce({rows: [{ subject_id: 2 }]});
            db.query.mockResolvedValueOnce({rows: [{ class_id: 1, class_name: 'History', subject_id: 2 }]});

            const result = await Teacher.createClass(3, 'History', 'History');

            expect(result).toEqual({class_id: 1, class_name: 'History', subject_id: 2});
        });

        it('should throw error if teacher is not found', async () => {
            db.query.mockResolvedValueOnce({rows: []});

            await expect(Teacher.createClass(1001, 'Biology', 'Science')).rejects.toThrow('Teacher not found');
        });

        it('should throw error if class already exists', async () => {
            db.query.mockResolvedValueOnce({rows: [{teacher_id: 1}]});
            db.query.mockResolvedValueOnce({rows: [{1: 1}]});

            await expect(Teacher.createClass(1001, 'History', 'History')).rejects.toThrow('Class "History" already exists for this teacher');
        });

        it('should throw error if subject is not found', async () => {
            db.query.mockResolvedValueOnce({ rows: [{teacher_id: 1}] });
            db.query.mockResolvedValueOnce({ rows: [] });
            db.query.mockResolvedValueOnce({ rows: [] });

            await expect(Teacher.createClass(1001, 'History', 'UnknownSubject')).rejects.toThrow('Subject "UnknownSubject" not found');
        });
    });
});