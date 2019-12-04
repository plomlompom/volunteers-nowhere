import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { Bert } from 'meteor/themeteorchef:bert'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'

import { Volunteers } from '../../../../both/init'
import { T, t } from '../../common/i18n'

const enroll = ({
  duty,
  policy,
  teamId: parentId,
  ...details
}) => {
// TODO This duplicates logic from meteor-volunteers apply code and confirmation should happen in
// the method not in the frontend
  Meteor.call(
    `${Volunteers.eventName}.Volunteers.${duty}Signups.insert`, {
      ...details,
      parentId,
      enrolled: true,
    },
    (err, signupId) => {
      if (err) {
        switch (err.error) {
          case 409: {
            if (err.reason === 'Double Booking') {
              Bert.alert({
                hideDelay: 6500,
                title: t('double_booking'),
                /* XXX: add details of the other bookings stored in err.details */
                /* message: applyContext(templatebody, err),  */
                message: t('double_booking_msg'),
                type: 'warning',
                style: 'growl-top-right',
              })
            } else {
              Bert.alert({
                hideDelay: 6500,
                title: t('shift_full'),
                message: t('shift_full_msg'),
                type: 'warning',
                style: 'growl-top-right',
              })
            }
            break
          }
          default:
            Bert.alert({
              hideDelay: 6500,
              title: t('error'),
              message: err.reason,
              type: 'danger',
              style: 'growl-top-right',
            })
        }
      } if (signupId && (policy === 'requireApproval' || policy === 'adminOnly')) {
        if (duty === 'lead') {
          Meteor.call(`${Volunteers.eventName}.Volunteers.leadSignups.confirm`, signupId)
        } else {
          Meteor.call(`${Volunteers.eventName}.Volunteers.${duty}Signups.setStatus`, {
            id: signupId,
            status: 'confirmed',
          })
        }
      }
    },
  )
}

// TODO wrap with an async methos HOC for loading state
export const ShiftEnrollButton = details => (
  <button
    type="button"
    className="btn btn-primary fl"
    onClick={() => enroll(details)}
  >
    <T>enroll</T>
  </button>
)

export const ProjectEnrollButton = ({
  start,
  end,
  ...details
}) => {
  const [[startEnroll, endEnroll], setEnrollDates] = useState([])
  return (
    <div>
      <Flatpickr
        className="form-control"
        options={{
          mode: 'range',
          dateFormat: 'Y-m-d',
          altFormat: 'F j, Y',
          minDate: start,
          maxDate: end,
        }}
        onClose={setEnrollDates}
      />
      <button
        type="button"
        className="btn btn-primary float-right"
        disabled={!startEnroll || !endEnroll}
        onClick={() => enroll({ start: startEnroll, end: endEnroll, ...details })}
      >
        <T>enroll</T>
      </button>
    </div>
  )
}

export const getShiftEnrollButton = ({
  duty,
  ...details
}) => ({ userId }) => {
  if (duty === 'project') {
    return ProjectEnrollButton({
      duty,
      ...details,
      userId,
    })
  }
  return ShiftEnrollButton({
    duty,
    ...details,
    userId,
  })
}
