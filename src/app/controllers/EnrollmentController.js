import * as Yup from 'yup';
import { startOfDay, isBefore, parseISO, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import WelcomeMail from '../jobs/WelcomeMail';

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    if (page <= 0) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }
    const enrollments = await Enrollment.findAll({
      order: [['id', 'ASC']],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'price', 'duration'],
        },
      ],
    });
    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { student_id, plan_id } = req.body;
    let { start_date } = req.body;

    /**
     * Check if student exists
     */
    const student = await Student.findByPk(student_id);
    if (!student) return res.status(400).json({ error: 'Student not found' });

    /**
     * Check if plan exists
     */
    const plan = await Plan.findByPk(plan_id);
    if (!plan) return res.status(400).json({ error: 'Plan not found' });

    /**
     * Check if user already has an enrollment
     */
    const enrollmentExists = await Enrollment.findOne({
      where: { student_id },
    });
    if (enrollmentExists)
      return res.status(400).json({
        error: 'Student is already enrolled',
      });

    /**
     * Check for past dates
     */
    start_date = startOfDay(parseISO(start_date));
    if (isBefore(start_date, new Date()))
      return res.status(400).json({ error: 'Past dates are not permitted' });

    const end_date = addMonths(start_date, plan.duration);
    const price = plan.price * plan.duration;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Queue.add(WelcomeMail.key, { student, plan, enrollment });

    return res.json({ student_id, plan_id, start_date, end_date, price });
  }

  // TODO
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { title } = req.body;
    const plan = await Enrollment.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({
        error: 'Plan not found',
      });
    }
    if (title && title !== plan.title) {
      const planExists = await Enrollment.findOne({
        where: { title },
      });
      if (planExists)
        return res.status(400).json({
          error: 'A plan with this title already exists',
        });
    }

    const { id, duration, price } = await plan.update(req.body);
    return res.json({ id, title, duration, price });
  }

  // TODO
  async delete(req, res) {
    const plan = await Enrollment.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    plan.destroy();
    return res.json();
  }
}

export default new EnrollmentController();
