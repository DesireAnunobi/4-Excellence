const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, Student, Teacher } = require('../models/User.js');

async function getUserStats(req, res) {
    try {
        
        const stats = await Student.getUserStats(req.params.id);
        res.status(200).json(stats); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getUserInfo(req,res){
    try {
        const userInfo = await User.getUserInfo(req.params.id)
        res.status(200).json(userInfo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function createUser(req, res) {
    try {
        const { username, password, is_teacher, school_name='None' } = req.body;
        const user = await User.createUser({ username, password, is_teacher, school_name });

        const payload = {username: user.username};
        
        const sendToken = (err, token) => {
            if (err) {
                throw new Error('Error in token generation');
            }
            res.status(200).json({
                success: true,
                userID: user.user_id,
                username: user.username,
                token: token
            });
        };

        jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: 3600}, sendToken);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function CheckUserExists(req, res) {
    try {

        const { username, password, is_teacher } = req.body;
        const user = await User.CheckUserExists(username, password, is_teacher);

        if (user.success) {
            const payload = {username: user.username};

            const sendToken = (err, token) => {
                if (err) {
                    throw new Error('Error in token generation');
                }
                res.status(200).json({
                    success: true,
                    userID: user.user_id,
                    username: user.username,
                    token: token
                });
            };

            jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: 3600}, sendToken);
        } else {
            throw new Error('User could not be authenticated');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const username  = req.params.username;
        
        const deletedUser = await User.deleteUser(username);
        
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ 
            message: 'User deleted successfully',
            deletedUsername: deletedUser.username,
            deletedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function deleteClass(req, res) {
    try {
        const teacherId = req.params.teacherid;
        const classId = req.params.class;

    
        if (!teacherId || !classId) {
            return res.status(400).json({
                success: false,
                message: "Teacher ID and Class ID are required"
            });
        }

        const result = await Teacher.deleteClass(teacherId, classId);
        console.log(result.deletedClass)
        
        res.status(200).json({
            success: true,
            data: result.deletedClass,
            message: "Class deleted successfully"
            
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getStudentsInClass(req, res) {
    try {
        const classId = req.params.id;
      
      const result = await User.getStudentsInClass(classId || null);
  
      if (Object.keys(result).length === 0) {
        return res.status(404).json({ message: 'No students found' });
      }
  
      res.status(200).json(result);
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  
  async function getClassByTeacher(req, res) {
    try {
      const teacherId = req.params.id;
  
      if (!teacherId) {
        return res.status(400).json({ message: 'Teacher ID is required' });
      }
  
      const classes = await Teacher.getClassByTeacher(teacherId);
  
      if (!classes || classes === "No Results") {
        return res.status(404).json({ message: 'No classes found for this teacher' });
      }
  
      res.status(200).json({ classes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async function getClasses(req, res) {
    try {
    const teacherId = req.params.teacherid; // From URL
      const classID = req.params.id;
  
      if (!classID) {
        return res.status(400).json({ message: 'Class ID is required' });
      }
  
      const classes = await Teacher.getClasses(classID, teacherId);
  
      if (!classes || classes === "No Results") {
        return res.status(404).json({ message: 'No classes found ' });
      }
  
      res.status(200).json({ classes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async function getAllClasses(req,res){
    try {
        const teacherId = req.params.teacherid; // From URL
        const classes = await Teacher.getAllClasses(teacherId);
        res.status(200).json(classes)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// TEACHER FUNCTIONS

async function createClass(req, res) {
    try {
        const teacherId = req.params.teacherid;
        const { className, subject } = req.body;
        
        const newClass = await Teacher.createClass(teacherId, className, subject);
      
        res.status(201).json(newClass);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateClassDetails(req, res) {
    try {
        const teacherId = req.params.teacherid;
        const classId = req.params.classId;
        // console.log('teacher ID:', teacherId)
        // console.log('class ID:', classId)
        const { className } = req.body;
        console.log(className)

        const updatedClass = await Teacher.updateClass(teacherId, classId, className);
        res.status(200).json(updatedClass);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




module.exports = { 
    getUserStats, 
    createUser, 
    CheckUserExists, 
    deleteUser, 
    getUserInfo, 
    getStudentsInClass,
    getClassByTeacher,
    getClasses,
    getAllClasses,
    deleteClass,
    createClass,
    updateClassDetails

};