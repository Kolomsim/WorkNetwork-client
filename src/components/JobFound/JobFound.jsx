import React, { useState } from 'react'
import axios from 'axios'

const JobSearch = () => {
	const [query, setQuery] = useState('')
	const [jobs, setJobs] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const handleSearch = async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await axios.get('https://api.hh.ru/vacancies', {
				params: {
					text: query,
					per_page: 10,
				},
			})
			setJobs(response.data.items)
		} catch (err) {
			setError('Ошибка при получении данных. Попробуйте еще раз.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='job-search-container'>
			<h2>Поиск работы</h2>
			<div className='job-settings'>
				<input
					className='search-input'
					type='text'
					value={query}
					onChange={e => setQuery(e.target.value)}
					placeholder='Введите название вакансии'
				/>
				<button onClick={handleSearch}>Поиск</button>
			</div>
			{loading && <p>Загрузка...</p>}
			{error && <p>{error}</p>}
			<div className='job-cards'>
				{jobs.map(job => (
					<div key={job.id} className='job-card'>
						<h3>{job.name}</h3>
						<p>{job.employer.name}</p>
						<a
							href={job.alternate_url}
							target='_blank'
							rel='noopener noreferrer'
						>
							Подробнее
						</a>
					</div>
				))}
			</div>
		</div>
	)
}

export default JobSearch
