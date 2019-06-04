import { GraphQLServer } from 'graphql-yoga'

// Demo user data
const movies = [{
    id: '1',
    title: 'The Godfather Part 2',
    released: true
},
{
    id: '2',
    title: 'Pulp Fiction',
    released: true
}
]

const actors = [{
    id: '101',
    name: 'Marlon Brando',
    movie: '1'
},{
    id: '102',
    name: 'Robert De Nilo',
    movie: '1'
},{
    id: '103',
    name: 'Al Pacino',
    movie: '1'
},
{
    id: '104',
    name: 'John Travolta',
    movie: '2'
},
{
    id: '105',
    name: 'Samuel L. Jackson',
    movie: '2'
}]

// Type definition (Schema)
const typeDefs = `
    type Query {
        movies(query: String): [Movie!]!
        actors: [Actor!]!
    }
    
    type Movie {
        id: ID!
        title: String!
        released: Boolean
        actors: [Actor!]
    }

    type Actor {
        id: ID!
        name: String!
        movie: [Movie]!
    }
`
// Resolvers
const resolvers = {
    Query: {
        movies(parent, args, ctx, info) {

            // If the search query does not exist, just return the list
            if(!args.query) {
                return movies
            }

            // It should filter out items that don't align with the query definitions
            return movies.find((movie) => {
                return movie.title.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        actors(parent, args, ctx, info) {

            return actors
            
        }
    },

    // Querying for an individual movie
    Movie: {
        actors(parent, args, ctx, info) {
            return actors.filter((actor) => {
                return actor.movie === parent.id
            })
        }
    },

    // Querying for an individual movie
    Actor: {
        movie(parent, args, ctx, info) {
            return movies.filter((movie) => {
                return movie.id === parent.movie
            })
        }
    }

}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log('This server is running on the port 4000')
})