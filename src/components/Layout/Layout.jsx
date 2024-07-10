import React from 'react'
import Header from '../Header/Header.jsx'
import Footer from '../Footer/Footer.jsx'
import Sidebar from '../Sidebar/Sidebar.jsx'

const Layout = ({ children }) => {
	return (
		<div className='layout'>
			<Header />
			<Sidebar />
			<div className='content'>
				<main>{children}</main>
			</div>
			<Footer />
		</div>
	)
}

export default Layout
