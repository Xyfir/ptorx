import { EmailNavigation } from 'components/emails/Navigation';
import { loadEmails } from 'actions/emails';
import { EmailForm } from 'components/emails/Form';
import { Button } from 'react-md';
import * as React from 'react';
import * as swal from 'sweetalert';
import * as copy from 'copyr';
import { api } from 'lib/api';

export class EditEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: location.hash.split('/')[3],
      loading: true
    };
  }

  componentDidMount() {
    const { App } = this.props;
    const email = App.state.emails.find(e => e.id == this.state.id);

    if (!email) location.href = '#/emails/list';

    api
      .get(`/emails/${this.state.id}`)
      .then(res => {
        this.setState(Object.assign({ loading: false }, res.data));
      })
      .catch(() => swal('Error', 'Could not load data', 'error'));
  }

  onSubmit(data) {
    const { App } = this.props;
    api
      .put(`/emails/${this.state.id}`, data)
      .then(() => {
        App.dispatch(loadEmails([]));
        location.hash = '#/emails/list';
        swal('Success', `Email '${data.name}' updated`, 'success');
      })
      .catch(err => swal('Error', err.response.data.error, 'error'));
  }

  render() {
    const email = this.state;
    if (email.loading) return null;

    return (
      <div className="edit-email">
        <EmailNavigation email={email.id} />

        <div className="address">
          <span>{email.address}</span>
          <Button
            icon
            primary
            tooltipPosition="right"
            tooltipLabel="Copy to clipboard"
            iconChildren="content_copy"
            onClick={() => copy(email.address)}
          />
        </div>

        <EmailForm
          {...this.props}
          email={email}
          onSubmit={d => this.onSubmit(d)}
        />
      </div>
    );
  }
}