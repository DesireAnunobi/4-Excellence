const {getUserStats, createUser, CheckUserExists, getClassByTeacher, createClass} = require('../../../server/controllers/user.js');
const {User, Student, Teacher} = require('../../../server/models/User.js');

jest.mock('bcrypt');
const bcrypt = require('bcrypt');

jest.mock('jsonwebtoken');
const jwt = require('jsonwebtoken');

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}));

const mockRes = { status: mockStatus };

describe('User Controller', () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())
  
  describe('getUserStats', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = { params: { id: 1 } }
    });

    it('should return user statistics with status code 200', async () => {
      jest.spyOn(Student, 'getUserStats').mockResolvedValue([{"avg_score": 8, "best_score": 10, "game_id": 1, "last_score": 6, "student_id": 1, "times_played": 2}]);

      await getUserStats(mockReq, mockRes);

      expect(Student.getUserStats).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith([{"avg_score": 8, "best_score": 10, "game_id": 1, "last_score": 6, "student_id": 1, "times_played": 2}])
    });

    it('should return an error if something went wrong', async () => {
      jest.spyOn(Student, 'getUserStats').mockRejectedValue(new Error('oh no'))

      await getUserStats(mockReq, mockRes);

      expect(Student.getUserStats).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' });
    });
  });

  describe('createUser', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = {
        body: {
          username: 'testuser',
          password: 'testpass',
          is_teacher: false,
          school_name: 'None'
        }
      };
    })

    it('should return a webtoken with status code 200', async () => {
      const mockUser = {
        username: 'testuser',
        user_id: 1,
      };

      jest.spyOn(User, 'createUser').mockResolvedValue(mockUser);

      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'fake.jwt.token');
      });

      await createUser(mockReq, mockRes);

      expect(User.createUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
        is_teacher: false,
        school_name: 'None',
      });

      expect(jwt.sign).toHaveBeenCalledWith(
        { username: 'testuser' },
        process.env.SECRET_TOKEN,
        { expiresIn: 3600 },
        expect.any(Function)
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        userID: 1,
        username: 'testuser',
        token: 'fake.jwt.token',
      });
    });

    it('should return an error if something went wrong', async () => {
      jest.spyOn(User, 'createUser').mockRejectedValue(new Error('oh no'));
      
      await createUser(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' });
    });
  });

  describe('CheckUserExists', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = {
        body: {
          username: 'testuser',
          password: 'testpass',
          is_teacher: false,
        }
      };
    })

    it('should return a webtoken with status code 200', async () => {
      const mockUser = {
        success: true,
        username: 'testuser',
        user_id: 1,
      };

      jest.spyOn(User, 'CheckUserExists').mockResolvedValue(mockUser);

      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'fake.jwt.token');
      });

      await CheckUserExists(mockReq, mockRes);

      expect(User.CheckUserExists).toHaveBeenCalledWith(
        'testuser',
        'testpass',
        false
      );

      expect(jwt.sign).toHaveBeenCalledWith(
        { username: 'testuser' },
        process.env.SECRET_TOKEN,
        { expiresIn: 3600 },
        expect.any(Function)
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        userID: 1,
        username: 'testuser',
        token: 'fake.jwt.token',
      });
    });

    it('should throw an error if authentication failed', async () => {
      const mockUser = {
        success: false,
        username: 'testuser',
        user_id: 1,
      };

      jest.spyOn(User, 'CheckUserExists').mockResolvedValue(mockUser);

      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'fake.jwt.token');
      });

      await CheckUserExists(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'User could not be authenticated' });
    });

    it('should return an error if something went wrong', async () => {
      jest.spyOn(User, 'CheckUserExists').mockRejectedValue(new Error('oh no'));
      
      await CheckUserExists(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' });
    });
  });

  describe('getClassByTeacher', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = { params: { id: 1 } }
    })

    it('should return all classes owned by a teacher with status code 200', async () => {
      jest.spyOn(Teacher, 'getClassByTeacher').mockResolvedValue([{ class_name: 'Class 9A' }, { class_name: 'Class 10A' }]);

      await getClassByTeacher(mockReq, mockRes);

      expect(Teacher.getClassByTeacher).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({classes: [{ class_name: 'Class 9A' }, { class_name: 'Class 10A' }]});
    });

    it('should return teacherID is required if missing with status code 400', async () => {
      mockReq = { params: { id: null } }

      jest.spyOn(Teacher, 'getClassByTeacher').mockResolvedValue([{ class_name: 'Class 9A' }, { class_name: 'Class 10A' }]);

      await getClassByTeacher(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Teacher ID is required' });
    });

    it('should return no classes found if no classes were found with status code 404', async () => {
      jest.spyOn(Teacher, 'getClassByTeacher').mockResolvedValue();

      await getClassByTeacher(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'No classes found for this teacher' });
    });

    it('should return an error if something goes wrong with status code 500', async () => {
      jest.spyOn(Teacher, 'getClassByTeacher').mockRejectedValue(new Error('oh no'));
      
      await getClassByTeacher(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' });
    });
  });

  describe('createClass', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = { 
        params: { teacherid: 1 },
        body: {className: 'Class 9A', subject: 'History'}
      }
    })

    it('should create and return a new class with status code 200', async () => {
      jest.spyOn(Teacher, 'createClass').mockResolvedValue({class_id: 1, class_name: 'Class 9A', subject_id: 2});

      await createClass(mockReq, mockRes);

      expect(Teacher.createClass).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({class_id: 1, class_name: 'Class 9A', subject_id: 2});
    });

    it('should return an error if something goes wrong with status code 500', async () => {
      jest.spyOn(Teacher, 'createClass').mockRejectedValue(new Error('oh no'));
      
      await createClass(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' });
    });
  });
});