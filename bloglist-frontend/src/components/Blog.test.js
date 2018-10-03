import React from 'react'
import { shallow } from 'enzyme'
import Blog from './Blog'

describe.only('<Blog />', () => {
    let blogComponent
    let blog
    

    beforeEach(()=> {
        blog = {
            title: "Hunajablogi",
            author: "Otso Kontio",
            url: "https://hunajablogi.fi",
            likes: 50,
            user: {
                username: 'kotka',
                name: 'Meri Kotka'
            }
        }

        const user = {
            username: 'kotka',
            name: 'Meri Kotka' 
        }

        const mockHandler = jest.fn()
             
        blogComponent = shallow(<Blog blog={blog} currentUser={user} deleteFunction={mockHandler}  />)
    })

    test('initially only the author and title are shown', () => {
  
        const contentDiv = blogComponent.find('.details')
          
        expect(contentDiv.getElement().props.style.display).toEqual('none')

    })

    test('after clicking the name the details are displayed', () => {

        const nameDiv = blogComponent.find('.nameAndAuthor')
        nameDiv.simulate('click')

        const contentDiv = blogComponent.find('.details')

        expect(contentDiv.getElement().props.style.display).toEqual('')

        console.log(contentDiv.getElement().props.style)
     })
})

