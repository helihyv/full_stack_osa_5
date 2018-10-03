let token = null

const blogs = [
   
    {
        _id: "5b855b8f77f83e4069b59802",
        user: {
        _id: "5b84e2574798a53ae9620f3d",
        username: "otso",
        name: "Otso Kontio"
        },
        likes: 1,
        author: "Susi Hukkanen",
        title: "hirviblogi",
        url: "https://hirviblogi.fi"
        },
        {
        _id: "5b855dd61b6e1742056a957c",
        user: {
        _id: "5b84e28c4798a53ae9620f3f",
        username: "ammu",
        name: "Mansikki Ammu"
        },
        likes: 10,
        author: "Mansikki ammu",
        title: "Heinäblogi",
        url: "https://heinäblogi.fi"
        },
        {
        _id: "5b8680f422fc0c5d60e0784f",
        user: {
        _id: "5b84e2574798a53ae9620f3d",
        username: "otso",
        name: "Otso Kontio"
        },
        likes: 0,
        author: "Ahma Ahmatti",
        title: "poroblogi",
        url: "https://poroblogi.fi"
        }
]

const getAll = () => {
    return Promise.resolve(blogs)
}

const setToken = (newToken) => {
    token = newToken
}

export default { getAll, setToken, blogs}