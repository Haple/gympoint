import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';

class AnswerHelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      order: [['id', 'DESC']],
      attributes: ['id', 'question', 'created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const bodySchema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    const paramsSchema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (
      !(await bodySchema.isValid(req.body)) ||
      !(await paramsSchema.isValid(req.params))
    ) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const helpOrder = await HelpOrder.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!helpOrder)
      return res.status(404).json({
        error: 'Help order not found',
      });

    const {
      id,
      question,
      student: { name: student, email },
      answer,
    } = await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    /**
     * Send an email to student with the answer
     */
    await Queue.add(HelpOrderAnswerMail.key, {
      question,
      answer,
      student,
      email,
    });

    return res.json({ id, question, answer });
  }
}

export default new AnswerHelpOrderController();
