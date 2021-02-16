import React from 'react';
import SearchTool from './searchTool/SearchTool';
import Results from './results/Results';
import flightsCall from './utils/flightsCall';
import {withRouter} from 'react-router-dom';

class Search extends React.Component {

  state = {
    data: [],
    query: "",
    total: 0,
    loading: 0
  }

  componentDidMount(){
    this.findFlights(this.props.location.search);
  }

  componentDidUpdate(){
    this.findFlights(this.props.location.search);
  }

  updateData = (total, loading, data) => {
    if(data !== undefined){
      this.state.data.push(data);
      this.setState({total: total, loading: loading, data: this.state.data});
    }else{
      this.setState({total: total, loading: loading});
    }
  }

  findFlights(query){
    if(this.state.query !== query && query.length > 0){
      const queryString = require('query-string');
      const parsed = queryString.parse(query);
      const origin = parsed.Origin.split(' ')[0];
      const destResult = parsed.Destinations.split(' ');
      const destinations = destResult.slice(0, destResult.length-1);
      const fromDate = parsed.fromDate;
      const toDate = parsed.toDate;
      this.setState({ query: query, data: [], myLocation: origin, fromDate: new Date(fromDate) });
      flightsCall({fromDate: fromDate, toDate: toDate, origin: origin, destinations: destinations}, this.updateData);
    }
  }

  render(){
    return (
      <>
        <div className="searchPanel" style={{minHeight: window.innerHeight/3}}>
          <div className="header" style={{height: '25px'}}></div>
          <h1>Search Flights</h1>
          <SearchTool/>
        </div>
        <div className="loading" style={{width: `${(100*this.state.loading)/this.state.total}%`, backgroundColor: ((this.state.total !== this.state.loading) ? ('#FF8B8B') : ('#7EC9A1'))}}/>
        <Results data={this.state.data} myLocation={this.state.myLocation} fromDate={this.state.fromDate}/>
      </>
    );
  }
}

export default withRouter(Search);