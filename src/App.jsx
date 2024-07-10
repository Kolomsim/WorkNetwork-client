import React, { useState, useEffect } from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import RegisterPage from './pages/LoginSignup/Signup.jsx'
import LoginPage from './pages/LoginSignup/Login.jsx'
import ChatPage from './pages/Chat/Chat.jsx'
import UserPage from './pages/UserProfile/userProfile.jsx'
import ProfilePage from './pages/UserProfile/userProfile.jsx'
import Layout from './components/Layout/Layout.jsx'
import ListOfGroups from './components/ListOfGroups/ListOfGroups.jsx'
import GroupPage from './components/Group/Group.jsx'
import ForumsPage from './components/ListOfForum/ListOfForum.jsx'
import TopicPage from './components/ForumTopic/Topic.jsx'
import JobSearch from './components/JobFound/JobFound.jsx'

function App() {
	const [authenticated, setAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const checkAuth = () => {
			const accessToken = localStorage.getItem('accessToken')
			if (accessToken) {
				setAuthenticated(true)
			}
			setLoading(false)
		}
		checkAuth()
	}, [])

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<Router>
			<Routes>
				<Route path='/signup' element={<RegisterPage />} />
				<Route
					path='/login'
					element={<LoginPage setAuthenticated={setAuthenticated} />}
				/>
				<Route
					path='*'
					element={<ProtectedRoutes authenticated={authenticated} />}
				/>
			</Routes>
		</Router>
	)
}

function ProtectedRoutes({ authenticated }) {
	return (
		<Layout>
			<Route
				path='/chats'
				element={authenticated ? <ChatPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/user/:username'
				element={authenticated ? <UserPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/groups'
				element={authenticated ? <ListOfGroups /> : <Navigate to='/login' />}
			/>
			<Route path='/job-search' element={<JobSearch />} />
			<Route
				path='/groups/:id'
				element={authenticated ? <GroupPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/forum'
				element={authenticated ? <ForumsPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/profile'
				element={authenticated ? <ProfilePage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/forums/:forumId'
				element={authenticated ? <TopicPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='*'
				element={
					authenticated ? <Navigate to='/chats' /> : <Navigate to='/login' />
				}
			/>
		</Layout>
	)
}

export default App
