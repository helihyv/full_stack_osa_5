import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Blog from './components/Blog'
import blogService from './services/blogs'

describe('App />', () => {
    let app

    describe('when user is not logged', () => {

        window.localStorage.clear()
        beforeEach(() => {
            app = mount(<App />)

        })

        test('only login form is rendered, does not render any blogs', () => {
            app.update()

            const blogComponents = app.find(Blog)
            expect(blogComponents.length).toEqual(0)
        })
    })

    describe('when user is logged', () => {
        beforeEach(() => {

            const user ={
                username: 'tester',
                token: '1231231214',
                name: 'Teuvo Testaaja'
            }

            window.localStorage.setItem('loggedBloglistUser',JSON.stringify(user))

            app = mount(<App />)

        })

        test('all blogs are rendered', () =>  {

            app.update()

            const blogComponents = app.find(Blog)
   
            expect(blogComponents.length).toEqual(blogService.blogs.length)
        })
    })

})