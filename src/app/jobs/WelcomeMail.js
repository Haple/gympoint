import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { student, plan, enrollment } = data;
    const date_format = "dd 'de' MMMM 'de' yyyy";
    const start_date = format(parseISO(enrollment.start_date), date_format, {
      locale: pt,
    });
    const end_date = format(parseISO(enrollment.end_date), date_format, {
      locale: pt,
    });
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Boas vindas',
      template: 'welcome',
      context: {
        student: student.name,
        id: student.id,
        plan: plan.title,
        price: enrollment.price,
        end_date,
        start_date,
      },
    });
  }
}

export default new WelcomeMail();
