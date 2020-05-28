import React from 'react';
import T from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress, Typography } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

import { useStyles } from '/imports/ui/core/hooks';

export const CreateForm = ({ onSubmit, loading }) => {
    const classes = useStyles();

    return (
        <Formik
            initialValues={{ name: '' }}
            validate={(values) => {
                const errors = {};

                if (!values.name) {
                    errors.name = 'Required';
                }

                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ submitForm, isSubmitting }) => (
                <Form className={classes.containerCenter}>
                    <h1>Word Slam!</h1>
                    <fieldset className={classes.noBorder} disabled={loading}>
                        <Field
                            component={TextField}
                            className={classes.textField}
                            name="name"
                            type="text"
                            label="Enter your name"
                        />
                        {isSubmitting && <LinearProgress />}
                    </fieldset>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                    >
                        Play
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

CreateForm.propTypes = {
    onSubmit: T.func.isRequired,
    loading: T.bool,
};
