import { MailtrapClient } from "mailtrap"

export const sendEmail = async(to: string, subject: string, body:string) => {
    const mailtrap = new MailtrapClient({
        token: process.env.MAILTRAP_TOKEN as string,
        testInboxId: 3249910,
        accountId: Number(process.env.MAILTRAP_ACCOUNT_ID)
    });

    try {
        await mailtrap.testing.send({
            from: {name: 'Sistema', email: 'contato@example.com'},
            to:[{email: to}],
            subject,
            text: body,
            category: "Integration Test",
        }).then(console.log, console.error);
        return true;
    } catch (err) {
        return false;
    }
}