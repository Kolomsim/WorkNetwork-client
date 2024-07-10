import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import CommentSend from '../CreateMessages/SendComments.jsx'

const Topic = () => {
	const { forumId } = useParams()
	const [forum, setForum] = useState(null)
	const [comments, setComments] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [replyingTo, setReplyingTo] = useState(null)
	const [createdNewComment, setCreatedNewComment] = useState(null)
	const [modalImage, setModalImage] = useState(null)

	useEffect(() => {
		const fetchForum = async () => {
			const authToken = localStorage.getItem('accessToken')
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/forums/${forumId}/comments`,
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
						params: {
							page: currentPage,
							limit: 30,
						},
					}
				)
				setForum(response.data.forum)
				setComments(response.data.comments)
				setTotalPages(response.data.totalPages)
			} catch (error) {
				console.error('Ошибка при загрузке топика:', error)
			}
		}
		fetchForum()
	}, [forumId, currentPage, createdNewComment])

	const handleCreateComment = newCommentInfo => {
		setCreatedNewComment(newCommentInfo)
		setComments(prevComments => [...prevComments, newCommentInfo])
	}

	const handlePageChange = pageNumber => {
		setCurrentPage(pageNumber)
	}

	const formatDate = timestamp => {
		const date = new Date(timestamp)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${hours}:${minutes} ${year}-${month}-${day}`
	}

	const renderAttachments = attachments => {
		return attachments.map((attachment, index) => (
			<div key={index} className='forum-attachment'>
				{attachment.endsWith('.jpg') ||
				attachment.endsWith('.png') ||
				attachment.endsWith('.jpeg') ? (
					<img
						src={`${import.meta.env.VITE_API_URL}/${attachment}`}
						alt={`Image ${index}`}
						onClick={() =>
							setModalImage(
								`${import.meta.env.VITE_API_URL}/${attachment}`
							)
						}
						className='attachment-image'
					/>
				) : (
					<a
						href={`${import.meta.env.VITE_API_URL}/${attachment}`}
						target='_blank'
						rel='noopener noreferrer'
					>
						Скачать файл {index + 1}
					</a>
				)}
			</div>
		))
	}

	const renderComments = (comments, parentId = null) => {
		return comments
			.filter(comment => comment.parent === parentId)
			.map(comment => (
				<div key={comment._id} className='forum-comment'>
					<div className='comment-header'>
						<div className='user-info'>
							<img
								src={`${import.meta.env.VITE_API_URL}/${
									comment.creator.avatar
								}`}
								alt={comment.creator.fullname}
								className='avatar'
							/>
							<div className='user-details'>
								<p className='user-fullname'>{comment.creator.fullname}</p>
								<small className='username'>
									Автор: {comment.creator.username}
								</small>
								{comment.parent && comment.parent.creator && (
									<small className='replying-to'>
										Ответ на комментарий пользователя{' '}
										{comment.parent.creator.username}
									</small>
								)}
							</div>
						</div>
						<div className='comment-date'>
							<small>Написано: {formatDate(comment.createdAt)}</small>
						</div>
					</div>

					<div className='comment-content'>
						<p>{comment.content}</p>
						<div className='attachments'>
							{comment.attachments && renderAttachments(comment.attachments)}
						</div>
						<button
							className='replyBtn'
							onClick={() => setReplyingTo(comment._id)}
						>
							Ответить
						</button>
						<div className='replies'>
							{renderComments(comments, comment._id)}
						</div>
					</div>
				</div>
			))
	}

	return (
		<div className='topic-container'>
			{forum ? (
				<>
					<h2>{forum.title}</h2>
					<p>{forum.description}</p>
					<div className='attachments'>
						{forum.attachments && renderAttachments(forum.attachments)}
					</div>
					<div className='comments-section'>
						<h3>Комментарии</h3>
						{comments.length === 0 ? (
							<p>Оставьте первый комментарий</p>
						) : (
							renderComments(comments)
						)}
						<div className='pagination'>
							{Array.from({ length: totalPages }, (_, index) => (
								<button
									key={index + 1}
									onClick={() => handlePageChange(index + 1)}
								>
									{index + 1}
								</button>
							))}
						</div>
						<div className='add-comment'>
							<CommentSend
								forumId={forumId}
								onCreateComment={handleCreateComment}
								replyingTo={replyingTo}
							/>
						</div>
					</div>
				</>
			) : (
				<p>Загрузка...</p>
			)}
			{modalImage && (
				<div className='attachment-modal' onClick={() => setModalImage(null)}>
					<span className='attachment-modal-close'>&times;</span>
					<img
						className='attachment-modal-content'
						src={modalImage}
						alt='Modal'
					/>
				</div>
			)}
		</div>
	)
}

export default Topic
