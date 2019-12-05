import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    if (page <= 0) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }
    const students = await Student.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'age', 'weigth', 'height'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      weigth: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists)
      return res.status(400).json({
        error: 'Student already exists.',
      });
    const { id, name, email, age } = await Student.create(req.body);
    return res.json({ id, name, email, age });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .positive(),
      weigth: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { email } = req.body;
    const student = await Student.findByPk(req.params.id);
    if (email && email !== student.email) {
      const studentExists = await Student.findOne({
        where: { email },
      });
      if (studentExists)
        return res.status(400).json({
          error: 'A student with this email already exists',
        });
    }

    const updatedStudent = await student.update(req.body);
    return res.json(updatedStudent);
  }
}

export default new StudentController();
