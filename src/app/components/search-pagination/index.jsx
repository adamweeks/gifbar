import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './styles.css';

class SearchPagination extends Component {
    constructor(props) {
        super(props);
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
    }

    decrement() {
        const {currentOffset, amount, changeOffset} = this.props;
        const offset = currentOffset >= amount ? currentOffset - amount : 0;
        changeOffset(offset);
    }

    increment() {
        const {currentOffset, amount, changeOffset} = this.props;
        const offset = currentOffset + amount;
        changeOffset(offset);
    }

    render () {
        const {forwardAvailable, previousAvailable, totalResults} = this.props;
        return (
            <div id="pagination">
                <div className="container">
                    <div className="item"><button onClick={this.decrement} disabled={!previousAvailable}>Prev</button></div>
                    <div className="item"><button onClick={this.increment} disabled={!forwardAvailable}>Next</button></div>
                    <div className="item">Results: {totalResults}</div>
                </div>
            </div>
        )
    }
}

SearchPagination.propTypes = {
    amount: PropTypes.number.isRequired,
    changeOffset: PropTypes.func.isRequired,
    currentOffset: PropTypes.number.isRequired,
    forwardAvailable: PropTypes.bool.isRequired,
    previousAvailable: PropTypes.bool.isRequired,
    totalResults: PropTypes.number.isRequired
}

export default SearchPagination
