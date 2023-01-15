import React, { useState, useEffect } from 'react';
import bot from './assets/bot.svg';
import user from './assets/user.svg';
import send from './assets/send.svg';
import './MainChat.css';

function Chat() {
	const [formValue, setFormValue] = useState('');
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoading(true);
		setMessages([...messages, { isAi: false, value: formValue }]);
		setFormValue('');

		const response = await fetch('http://localhost:5000/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				prompt: 'Ask me questions about what I know:' + formValue,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			const parsedData = data.bot.trim();
			console.log(parsedData);
			setMessages([
				...messages,
				{ isAi: false, value: formValue },
				{ isAi: true, value: parsedData },
			]);
		} else {
			const err = await response.text();

			alert(err);
		}
		console.log(messages);
		setLoading(false);
	};

	return (
		<div id='chat_container'>
			{messages.map((message, index) => (
				<div key={index} className='wrapper'>
					<div className='chat'>
						<div className='profile'>
							<img src={message.isAi ? bot : user} alt={message.isAi ? 'bot' : 'user'} />
						</div>
						<div className={`message ${loading && message.isAi ? 'loading' : ''}`}>
							{message.value}
						</div>
					</div>
				</div>
			))}
			<form onSubmit={handleSubmit}>
				<textarea value={formValue} onChange={(e) => setFormValue(e.target.value)} />
				<button type='submit'>
					<img src={send} alt='submit' />
				</button>
			</form>
		</div>
	);
}

export default Chat;
