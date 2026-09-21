import { type ParticipantID, type smlMode } from '../shared/types.js';
/**
 * Get information on a particiapnt ID
 * We perform DNS look up + SMP lookup
 */
export declare function participantLookup(participantID: ParticipantID, sml: smlMode): Promise<{
    participantID: string;
    totalDocuments: number;
    information: {
        ProcessIdentifier: {
            scheme: string | undefined;
            value: string;
        } | undefined;
        DocumentIdentifier: {
            scheme: string | undefined;
            value: string;
        } | undefined;
        EndpointReference: string | undefined;
        apCertificate: {
            certificate: string;
            serviceDescription: string | undefined;
            technicalContactUrl: string | undefined;
            subject?: string | undefined;
            issuer?: string | undefined;
            validFrom?: string | undefined;
            validTo?: string | undefined;
            serialNumber?: string | undefined;
        } | undefined;
        smpCertificate: {
            certificate: string;
            subject?: string | undefined;
            issuer?: string | undefined;
            validFrom?: string | undefined;
            validTo?: string | undefined;
            serialNumber?: string | undefined;
        } | undefined;
    }[];
    time: number;
} | undefined>;
