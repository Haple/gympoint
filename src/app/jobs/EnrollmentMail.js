import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { student, plan, enrollment } = data;

    let { duration } = plan;
    duration = duration > 1 ? `${duration} meses` : `${duration} mês`;
    const price = `R$${Number(plan.price).toFixed(2)}`;
    const total_price = `R$${Number(enrollment.price).toFixed(2)}`;
    const date_format = "dd 'de' MMMM 'de' yyyy";
    const start_date = format(parseISO(enrollment.start_date), date_format, {
      locale: pt,
    });
    const end_date = format(parseISO(enrollment.end_date), date_format, {
      locale: pt,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula GymPoint',
      template: 'enrollment',
      context: {
        student: student.name,
        plan: plan.title,
        duration,
        price,
        total_price,
        start_date,
        end_date,
        id: student.id,
      },
    });
  }
}

export default new EnrollmentMail();
