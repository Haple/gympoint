import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfDay, isBefore, parseISO, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import EnrollmentMail from '../jobs/EnrollmentMail';

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
      attributes: [
        'id',
        'start_date',
        'end_date',
        'canceled_at',
        'price',
        'active',
        'editable',
      ],
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
     * Check if user is already enrolled
     */
    const alreadyEnrolled = await Enrollment.findOne({
      where: {
        student_id,
        canceled_at: null,
        end_date: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (alreadyEnrolled)
      return res.status(400).json({ error: 'Student already enrolled' });

    /**
     * Check for past dates
     */
    const start_date = startOfDay(parseISO(req.body.start_date));
    if (isBefore(start_date, new Date()))
      return res.status(400).json({ error: 'Past dates are not allowed' });

    const end_date = addMonths(start_date, plan.duration);
    const price = plan.price * plan.duration;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    /**
     * Welcome email
     */
    await Queue.add(EnrollmentMail.key, { student, plan, enrollment });

    return res.json({
      id: enrollment.id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment)
      return res.status(404).json({ error: 'Enrollment not found' });

    /**
     * Reject update if enrollment start_date is before today
     * or if enrollment was canceled
     */
    if (
      isBefore(enrollment.start_date, new Date()) ||
      enrollment.canceled_at != null
    )
      return res.status(400).json({ error: 'Enrollment can not be updated' });

    const { plan_id } = req.body;
    const plan = await Plan.findByPk(plan_id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    /**
     * Check for past dates
     */
    const start_date = startOfDay(parseISO(req.body.start_date));
    if (isBefore(start_date, new Date()))
      return res.status(400).json({ error: 'Past dates are not allowed' });

    const end_date = addMonths(start_date, plan.duration);
    const price = plan.price * plan.duration;

    const { id, student_id } = await enrollment.update({
      start_date,
      end_date,
      plan_id,
      price,
    });
    return res.json({ id, student_id, plan_id, start_date, end_date, price });
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findOne({
      where: {
        id: req.params.id,
        canceled_at: null,
        end_date: {
          [Op.gte]: new Date(),
        },
      },
    });
    if (!enrollment)
      return res.status(404).json({ error: 'Enrollment not found' });
    enrollment.canceled_at = new Date();
    await enrollment.save();
    return res.json();
  }
}

export default new EnrollmentController();
