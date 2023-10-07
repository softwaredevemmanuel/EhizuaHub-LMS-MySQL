
import React, {useState,useEffect} from 'react'

const Test = () => {
    
    const[search,setSearch] = useState("")
    const[movies,setMovies] = useState([])

    const handlesubmit = (e)=>{
      e.preventDefault()
      setSearch(e.target.src.value)
       e.target.reset()
    }


    useEffect(()=>{
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNDc5ZThlMDRmMDIxNjlkMWIxOWNkYmI0NjRhM2JkOSIsInN1YiI6IjY1MTZkMzFkYzUwYWQyMDE0ZGNjY2Y4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QgN3tXIK5gFbPQX7qs12yxVVWSrORoZKESkSFcD2zNg'
        }
      };
     
      const url =`https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=1`
      fetch(url, options)
        .then(response => response.json())
        .then(response => setMovies(response.results))
        .catch(err => console.error(err));
  
    })
    

  return (
    <div>
        <form onSubmit={handlesubmit}>
            <input type="search" name="src" />
       </form> 
        



         { movies.map((items,id)=>{
              return(
                    
                   <div key={id}>
                             <img src={`https://image.tmdb.org/t/p/w500/${items.poster_path}`}  />
                             <h1 >{items.original_title} </h1>
                   </div>

              )
         })
         }
      
    </div>
  )
}

export default Test
