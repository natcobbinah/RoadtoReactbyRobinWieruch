import React, {Component} from 'react';
import './App.css';

/*   const list = [
   {
     title: 'React',
     url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
     num_comments: 3,
     points:4,
    objectID: 0
   },
   {
     title: 'Redux',
     url: 'https://github.com/react.js/redux',
     author: 'Dan Abramov, Andrew Clark',
     num_comments: 2,
     points:5,
     objectID: 1
   }
 ]; */ //not using dummy data list anymore


// function isSearched(searchTerm){
//   return function(item){
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase);
//   }
// } 

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query='; 
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

/* const isSearched = searchTerm => item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase());  
          we are not filtering the records on the client side anymore*/

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      result: null,
      //list, //not using dummy data list anymore
      searchTerm: DEFAULT_QUERY,
      helloWorld: 'Welcome to the Road to learn React'
    };

    this.searchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  onSearchSubmit(event){
    const {
      searchTerm
    } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  setSearchTopStories(result){

    const {
      hits, 
      page
    } = result;

    const oldHits = page !==0 ? this.state.result.hits : [];
    const updateHits = [
      ...oldHits,...hits
    ]

    this.setState({
        result:{
          hits: updateHits,
          page
        }
    });
  } 

  fetchSearchTopStories(searchTerm, page = 0){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
    .then(response => response.json())
    .then(result => this.searchTopStories(result))
    .catch(error => error);
  }

   componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  } 

  // onDismiss(id){
  //   const updateList = this.state.list.filter(item => item.objectID !== id);
  //   this.setState({   //not using dummy list data anymore
  //     list: updateList
  //   })
  // }

  
   onDismiss(id){
     const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);
     this.setState({
      // result: object.assign({},this.state.result, {hits : updatedHits}) this works but we prefer the spread opertor
      result: {...this.state.result, hits : updatedHits}
     })
   }

  onSearchChange(event){
    this.setState({
      searchTerm: event.target.value
    });
  }

  render(){
    const {
      searchTerm,
      //list, //not using dummy data list anymore
      result,
      helloWorld
    } = this.state;
    const page = (result && result.page) || 0;
  /*   if(!result){
      return null;
    } 
 */
    return (
      <div className="page">
        <TextoRender value={helloWorld}/>
        <div className="interactions">
           <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search</Search>
            <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More</Button>
        </div>
        {  //same as if not result display search but wait for the api to load the records
          //result ? <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>  we are not filtering from the client side anymore
          result ? <Table list={result.hits}  onDismiss={this.onDismiss}/>
            : null
        }
      </div>
    );
  }
}

const TextoRender = ({value}) => 
  <div>
      <p>{value}</p>
  </div>

const Search = ({value,onChange,onSubmit,children}) => 
<form onSubmit={onSubmit}>
      {children} <input type="text"  value={value} onChange={onChange} />
      <button type="submit">{children}</button>
</form>

//search on the client side is no longer used so we omit the pattern props
//const Table = ( {list,pattern,onDismiss}) =>
const Table = ( {list,onDismiss}) =>
<div className="table">
{/* //isSearched is not longer used because we are not filtering on the client side anymore
//{list.map(item =>  */}

{list.map(item => 
      <div key={item.objectID} className="table-row">
          <span  style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
          <span  style={{ width: '30%' }}>{item.author}</span>
          <span  style={{ width: '10%' }}>{item.num_comments}</span>
          <span  style={{ width: '10%' }}>{item.points}</span>
          <span  style={{ width: '10%' }}>
           <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
             Dismiss
           </Button>
          </span>
      </div>
)}
</div>

const Button = ({onClick, className='',children}) =>
<button onClick = {onClick} className={className} type="button">{children}</button>

export default App;