import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import {
  DEFAULT_QUERY,DEFAULT_HPP,PATH_BASE,PATH_SEARCH,PARAM_SEARCH,PARAM_PAGE,PARAM_HPP
  } from '../src/constants';
  import PropTypes from 'prop-types';
  import {sortBy} from 'lodash';

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

/* const DEFAULT_QUERY = 'redux'; now stored in a default folder structured and exported
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query='; 
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage='; */

/* const isSearched = searchTerm => item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase());  
          we are not filtering the records on the client side anymore*/

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
}

class App extends Component {
  _isMounted = false;

  constructor(props){
    super(props);

    this.state = {
      results: null,
      searchKey:'',
      //list, //not using dummy data list anymore
      searchTerm: DEFAULT_QUERY,
      helloWorld: 'Welcome to the Road to learn React',
      error: null,
      isLoading:false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.searchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event){
    const {
      searchTerm
    } = this.state;
    this.setState(
      {
        searchKey: searchTerm
      }
    )
    
    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  setSearchTopStories(result){

    const {hits, page} = result;
    this.setState(prevState => {
      const {searchKey, results} = prevState;
      const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
      const updateHits = [ ...oldHits,...hits]
      return{
      results:{
         ...results, [searchKey]: {hits: updateHits,page}
        },
        isLoading:false
      };
    });
  }

   /*  const{
      searchKey, results
    } = this.state; */

    // const oldHits = page !==0 ? this.state.result.hits : [];
    /* const updateHits = [
      ...oldHits,...hits
    ] */
  //} 

  fetchSearchTopStories(searchTerm, page = 0){
   /*  fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.searchTopStories(result))
    .catch(error => this.setState({
      error
    })); */

    //using axios library instead
    this.setState({isLoading: true});
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(result => this._isMounted && this.searchTopStories(result.data))
    .catch(error => this._isMounted && this.setState({
      error
    }))
  }

   componentDidMount(){
    this._isMounted = true;

    const {searchTerm} = this.state;
    this.setState(
      {
        searchKey: searchTerm
      }
    )
    this.fetchSearchTopStories(searchTerm);
  } 

  componentWillUnmount(){
    this._isMounted = false;
  }

  // onDismiss(id){
  //   const updateList = this.state.list.filter(item => item.objectID !== id);
  //   this.setState({   //not using dummy list data anymore
  //     list: updateList
  //   })
  // }

  
   onDismiss(id){
     const {searchKey, results} = this.state;
     const {hits,page} = results[searchKey];
     const updatedHits = hits.filter(item => item.objectID !== id);
     this.setState({
      // result: object.assign({},this.state.result, {hits : updatedHits}) this works but we prefer the spread opertor
      results: {...results,[searchKey] : {hits : updatedHits,page}
      }
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
      results,
      searchKey,
      error,
      helloWorld,
      isLoading,
     /*  sortKey,
      isSortReverse, */
    } = this.state;
    const page = (results && 
      results[searchKey] && 
      results[searchKey].page) || 0;
    
    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];
  /*   if(!result){
      return null;
    } 
 */
   /*  if(error){
      return <p>Something went wrong</p>
    } */
    return (
      <div className="page">
        <TextoRender value={helloWorld}/>
        <div className="interactions">
           <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search</Search>
            <ButtonWithLoading
              isLoading = {isLoading}
              onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                More
            </ButtonWithLoading>
            {/*   <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button> */}
        </div>
        {  //same as if not result display search but wait for the api to load the records
          //result ? <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>  we are not filtering from the client side anymore
          error ? <div className="interactions">
            <p>Something went wrong</p>
          </div>
          : <Table list={list}  onDismiss={this.onDismiss}/>
            
        }
      </div>
    );
  }
}
const TextoRender = ({value}) => 
  <div>
      <p>{value}</p>
  </div>


//const Search = ({value,onChange,onSubmit,children}) => 
class Search extends Component{
  componentDidMount(){
    if(this.input){
      this.input.focus();
    }
  }

  render(){
    const {value,onChange,onSubmit,children} = this.props;
    return(
      <form onSubmit={onSubmit}>
      {children} <input type="text"  value={value} onChange={onChange} />
      ref = {(node) => {this.input = node; }}
      <button type="submit">{children}</button>
     </form>
    );
  }
}

const Loading = () => 
      <div>Loading...</div>

//search on the client side is no longer used so we omit the pattern props
//const Table = ( {list,pattern,onDismiss}) =>


/* const Table = ( {list,sortKey,isSortReverse, onSort, onDismiss}) =>{
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList; 
  changed from functional state component to class component */

  class Table extends Component {
    constructor(props){
      super(props);

      this.state ={
        sortKey: 'NONE',
        isSortRevere: false,
      };
      this.onSort = this.onSort.bind(this);
    }

    onSort(sortKey){
      const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
      this.setState({sortKey,isSortReverse});
    }

    render(){                 
      const {list, onDismiss} = this.props;
      const {sortKey,isSortReverse} = this.state;
      const sortedList = SORTS[sortKey](list);
      const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList; 
  return(
    <div className="table">
    <div className="table-header">
        <span style={{width: '40%'}}>
          <Sort sortKey= {'TITLE'} onSort={this.onSort} activeSortKey={sortKey}>Title</Sort>
        </span>
        <span style={{width: '30%'}}>
          <Sort sortKey= {'AUTHOR'} onSort={this.onSort}  activeSortKey={sortKey}>Author</Sort>
        </span>
        <span style={{width: '10%'}}>
          <Sort sortKey= {'COMMENTS'} onSort={this.onSort}  activeSortKey={sortKey}>Comments</Sort>
        </span>
        <span style={{width: '10%'}}>
          <Sort sortKey= {'POINTS'} onSort={this.onSort}  activeSortKey={sortKey}>Points</Sort>
        </span>
    </div>
    {reverseSortedList.map(item => 
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
  )}
    }


/* isSearched is not longer used because we are not filtering on the client side anymore
{list.map(item =>   */


Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
    onDismiss: PropTypes.func.isRequired,
};

const Button = ({onClick, className='',children}) =>
<button onClick = {onClick} className={className} type="button">{children}</button>
Button.propTypes = {
  onClick : PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}

/* function withFoo(Component){
  return function(props){
    return <Component {...props}/>
  }
} */

//ES6
/* const withFoo = (Component) => (props) =>
  props.isLoading ?
  <Loading/> : 
  <Component {...props}/> */

  //more improved to avoid bugs
  const withLoading = (Component) => ({isLoading, ...rest}) =>
    isLoading ?
      <Loading/> :
      <Component {...rest}/>

      const ButtonWithLoading = withLoading(Button);

  const Sort = ({sortKey,activeSortkey, onSort, children}) => {
    const sortClass = ['button-inline'];

    if(sortKey === activeSortkey){
      sortClass.push('button-active');
    }

    return(
      <Button onClick = {() => onSort(sortKey)} className={sortClass.join('')}>
      {children}
    </Button>
    )
  }

export default App;

export {Button,Search,Table};