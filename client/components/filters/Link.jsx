import React from "react";

// Components
import Create from "./Create";

// Constants
import { filterTypes } from "../../constants/types";

// Modules
import findMatches from "../../lib/find-matching";

export default class LinkFilter extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            view: "search", search: { query: "", type: 0 }
        };
        
        this.onSearch = this.onSearch.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }
    
    onChangeView(view) {
        this.setState({ view });
    }
    
    onSearch() {
        this.setState({ search: {
            query: this.refs.search.value, type: +this.refs.type.value
        }});
    }
    
    onAdd(id) {
        this.props.onAdd(id);
    }

    render() {
        return (
            <div className="link-filter">
                {
                    this.state.view == "search"
                    ? <a onClick={this.onChangeView.bind(this, "create")}>Switch to 'Create New Filter' Mode</a>
                    : <a onClick={this.onChangeView.bind(this, "search")}>Switch to 'Find Existing Filter' Mode</a>
                }
                {
                    this.state.type == "search"
                    ? (
                        <div>
                            <input
                                type="text"
                                ref="search"
                                onChange={this.onSearch}
                                placeholder="Search"
                            />
                            <select ref="type" onChange={this.onSearch}>{
                                Object.keys(filterTypes).map(k => {
                                    return <option value={k}>{filterTypes[k]}</option>;
                                })
                            }</select>
                            <div className="list">{
                                findMatches(this.props.data.filters, this.state.search).map(f => {
                                    return (
                                        <div className="filter">
                                            <span className="type">{filterTypes[f.type]}</span>
                                            <span className="name"><a onClick={this.onAdd.bind(this, f.id)}>
                                                {f.name}
                                            </a></span>
                                            <hr />
                                            <span className="description">{f.description}</span>
                                        </div>
                                    );
                                })
                            }</div>
                        </div>
                    ) : (
                        <Create
                            data={this.props.data}
                            dispatch={this.props.dispatch}
                            onCreate={this.onAdd}
                        />
                    )
                }
            </div>
        );
    }

}