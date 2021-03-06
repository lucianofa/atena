import { achievementTypes } from '../config/achievements'
import LogController from '../controllers/LogController'
import { scoreTypes } from '../models/Score/schema'
import { sendInteractionToQueue } from '../services/queue'

const { DRIP_API_KEY, DRIP_ACCOUNT_ID } = process.env
const client = require('drip-nodejs')({
  token: DRIP_API_KEY,
  accountId: DRIP_ACCOUNT_ID
})

export const handleDripEvent = async payload => {
  try {
    const { data, occurred_at } = payload
    const { subscriber, properties } = data
    const {
      source,
      email_id,
      email_subject,
      email_name,
      email_type
    } = properties

    if (email_type !== 'Broadcast') return

    const dripEvents = {
      'newsletter impulso network': {
        scoreType: scoreTypes.newsletterRead,
        achievementType: achievementTypes.newslettersRead
      }
    }

    let scoreType, achievementType

    for (const [event, types] of Object.entries(dripEvents)) {
      const emailName = email_name.toLowerCase()

      if (emailName.includes(event)) {
        scoreType = types.scoreType
        achievementType = types.achievementType

        break
      }
    }

    if (!scoreType || !achievementType) return

    const interaction = {
      scoreType,
      achievementType,
      queries: {
        user: { email: subscriber.email },
        details: { 'details.email.subject': email_subject }
      },
      details: {
        email: {
          id: email_id,
          name: email_name,
          subject: email_subject
        },
        provider: source,
        occurredAt: occurred_at
      }
    }

    sendInteractionToQueue.add(interaction, { removeOnComplete: true })
  } catch (error) {
    LogController.sendNotify({
      file: 'src/services/handleDripEvent',
      error: error.toString(),
      payload
    })
  }
}

export const sendBatchOfUsersToDrip = subscribers => {
  const batch = {
    batches: [{ subscribers }]
  }

  client.updateBatchSubscribers(batch, errors => {
    if (errors) {
      LogController.sendError({
        file: 'services/drip.js - handleEvent',
        resume: errors.toString(),
        details: {
          firstUser: subscribers[0],
          lastUser: subscribers[subscribers.length - 1],
          total: subscribers.length
        }
      })
    }
  })
}
