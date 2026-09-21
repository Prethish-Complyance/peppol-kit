import { createHmac } from 'node:crypto';

/**
 * Get information on a particiapnt ID
 * We perform DNS look up + SMP lookup
 */
export function participantLookup(participantID: ParticipantID){
    
    if(!participantID){
        console.error('[Error]: You need to provide a valid Participant ID ("0235:1234567890") to lookup.')
    }   

}