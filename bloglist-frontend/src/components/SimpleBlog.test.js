import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'


describe.only(<SimpleBlog/>, () => {

    let simpleBlogComponent
    let blog
    let mockHandler

    beforeEach(() => {
        blog = {
            title: "Hunajablogi",
            author: "Otso Kontio",
            likes: 15
        }

        mockHandler = jest.fn()

        simpleBlogComponent = shallow(<SimpleBlog blog={blog} onClick={mockHandler} />)
        console.log(simpleBlogComponent.debug())


    }) 
    test('component renders the title, the author and the number of likes', () => {


        const titleDiv = simpleBlogComponent.find('.titleAndAuthor')


        expect(titleDiv.text()).toContain(blog.title)


        const likesDiv = simpleBlogComponent.find('.likes')


        expect(likesDiv.text()).toContain(blog.likes)

    })

    test('clicking the button twice calls event handler twice', () => {

        const button = simpleBlogComponent.find('button')
        for(let i=0;i<2;i++) {
            button.simulate('click')
        }

        expect(mockHandler.mock.calls.length).toBe(2)

    } )
})