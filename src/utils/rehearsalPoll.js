export function createRehearsalPoll(date) {
    const answers = ["10:00am", "11:00am", "2:00pm", "4:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "No Puedo"];
    const pollDuration = 96; // 4 days
    const poll = {poll: {
        question: {text: `Ensayo para el próximo ${date} 🗓️`},
        answers: answers.map(answer => ({text: answer})),
        allowMultiselect: true,
        duration: pollDuration},
        content: `@everyone :guitar: :drum:`,
    }

    return poll;
}