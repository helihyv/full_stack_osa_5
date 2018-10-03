import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
jest.mock('./services/blogs')

configure({ adapter: new Adapter( )})

let savedItems = {}

const localStorageMock = {
    setItem: (key, item) => {
        savedItems[key] = item
    },
    getItem: (key) => {
         return savedItems[key]
    },
    clear: () => {
        savedItems =  {}
    }
 }

window.localStorage = localStorageMock
