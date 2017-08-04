import React        from 'react';
import connectField from 'uniforms/connectField';
import {Component}  from 'react';
import Kronos_ from 'react-kronos';
import styles from '../lib/styles';
import themes from '../lib/themes';

import ApplicationField from './ApplicationField';

class ApplicationPreview extends Component {
    constructor () {
        super(...arguments);

        this.state = {model: undefined};

        this.onModel = this.onModel.bind(this);
        this._schema = eval(`(${this.props.value.schema})`);
    }

    componentWillReceiveProps (props) {
        if (this.props.value.schema !== props.value.schema) {
            this.onModel({});
            this._schema = eval(`(${props.value.schema})`);
        }
    }

    onModel (model) {
        this.setState({model: JSON.stringify(model, null, 4)});
    }

    render () {
        const Form = themes[this.props.theme].AutoForm;
        const link = styles[this.props.theme];

        const props = {...this.props.value};
        props.schema = this._schema;

        const kronosOptions = {
          color: '#2ECC71',
          font: 'Roboto',
          moment: {
            lang: 'fr',
          },
          format: {
            hour: 'HH:mm',
          }
        };
        const Kronos = props =>
            <div>
            <pre>{JSON.stringify({props}, null, 2)}</pre>
            <Kronos_
                date={ props.value }
                options={kronosOptions}
                format="DD/MM/YYYY"
                placeholder={ props.value }
                min={ new Date() }
                returnAs="JS_DATE"
            />
            </div>
            ;

        const KronosField = connectField(Kronos, { ensureValue: false });

        const determineComponentFromProps = props => {
              console.log(props);
              return KronosField;
            };

        const CustomAuto = props => {
              // This way we don't care about unhandled cases - we use default
              // AutoField as a fallback component.
              const Component = determineComponentFromProps(props) || AutoField;
              return (
              <Component {...props} />
          );
        };

        return (
            <div>
                {link}

                {this.props.errorMessage ? (
                    <span children={this.props.errorMessage} />
                ) : (
                    <Form key={this.props.value.schema} onChangeModel={this.onModel} {...props}>
                        <KronosField
                        name="date"/>
                    </Form>
                )}

                {this.state.model !== undefined && <br />}
                {this.state.model !== undefined && <pre children={this.state.model} />}
            </div>
        );
    }
}

export default connectField(ApplicationPreview, {baseField: ApplicationField});
