interface MailService {
  send(email: {
    email: string;
    name: string;
  }): Promise<{ id: number; email: string; name: string }>;
}

export default MailService;
