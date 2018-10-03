import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'


describe.only(<SimpleBlog/>, () => {

    let simpleBlogComponent
    let blog

    beforeEach(() => {
        blog = {
            title: "Hunajablogi",
            author: "Otso Kontio",
            likes: 15
        }

        simpleBlogComponent = shallow(<SimpleBlog blog={blog} />)
        console.log(simpleBlogComponent.debug())


    }) 
    test('component renders the title, the author and the number of likes', () => {


        const titleDiv = simpleBlogComponent.find('.titleAndAuthor')


        expect(titleDiv.text()).toContain(blog.title)


        const likesDiv = simpleBlogComponent.find('.likes')


        expect(likesDiv.text()).toContain(blog.likes)//.toString())

    })
})