import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }
    const { id } = req.params;

    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: id,
      },
      order: [['id', 'DESC']],
      attributes: ['id', 'question', 'answer', 'answer_at'],
    });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const bodySchema = Yup.object().shape({
      question: Yup.string().required(),
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
    const { id, question, student_id } = await HelpOrder.create({
      question: req.body.question,
      student_id: req.params.id,
    });
    return res.json({ id, question, student_id });
  }
}

export default new HelpOrderController();
