import { createHash, createHmac } from 'node:crypto';
import base32Encode from 'base32-encode'
import {promises as dns} from 'node:dns'
import { parseXml, type XmlDocument } from '@rgrove/parse-xml';
import { findElements, getText } from '../shared/helpers.js';
import { type ParticipantID, type smlMode } from '../shared/types.js';
import {X509Certificate} from 'node:crypto';

/**
 * Get information on a particiapnt ID
 * We perform DNS look up + SMP lookup
 */
export async function participantLookup(participantID: ParticipantID, sml: smlMode){
    const start = performance.now();
    
    if(!participantID){
        console.error('[Error]: You need to provide a valid Participant ID ("0235:1234567890") to lookup.')
        return 
    }   

    let normalizedparticipantID = participantID.toLowerCase() as ParticipantID

    const smpUrl = await resolveNaptrRecord(normalizedparticipantID, sml)
    const servicegroups = await smpLookup(smpUrl,normalizedparticipantID)

    if (!servicegroups) {
        console.error("Received Null response from SMP")
        return;
    }
    
    const servicegroupreferences = findElements(servicegroups, 'smp:ServiceMetadataReference')
    const serviceGroupReferencesUrls = servicegroupreferences.map((element) => element.attributes?.href).filter((url): url is string => Boolean(url));

    const serviceInformations = await Promise.all(
        serviceGroupReferencesUrls.map(async (url) => {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `SMP request failed: ${response.status} ${response.statusText}`
                );
            }

            return parseXml(await response.text());
        })
    );   

    const information = await Promise.all(
    serviceInformations.map((ele) => parseInformation(ele))
);
    const end = performance.now();

return {
        participantID,
        // serviceGroupReferencesUrls,
        totalDocuments: information.length,
        information,
        time: Number((end - start).toFixed(2))
    }
}


async function resolveNaptrRecord(normalizedparticipantID: ParticipantID, sml: smlMode ): Promise<string> {
    const hash = createHash('sha256').update(normalizedparticipantID, "utf-8").digest();
    const encodedhash = base32Encode(hash,"RFC4648",{ padding: false })
    const schemeId = "iso6523-actorid-upis";
    const smlDomain = sml === "production"
        ? "participant.sml.prod.tech.peppol.org"
        : "participant.sml.test.tech.peppol.org";

    const dnsLookupString = `${encodedhash}.${schemeId}.${smlDomain}`;
    let smpUrl;

    // Resolving DNS to find SMP
    try {
        const records = await dns.resolveNaptr(dnsLookupString);
        smpUrl = records[0].regexp.split("!")[2]
        return smpUrl
    }
    catch(e){
        throw new Error(
            `Participant ID is not registered in ${sml} SML`
        );
    }
}

async function smpLookup(smpUrl: string,normalizedparticipantID: string){
    try {
        if(!smpUrl){
            console.error("SMP Url is not found!")
            return
        }
        const response =  await fetch(smpUrl + "/iso6523-actorid-upis::" + normalizedparticipantID);
        if(!response.ok){
            console.error("The SMP did not respond")
            return
        }
        const responseXml = await response.text()
        const responseJson = parseXml(responseXml);
        return responseJson
    } catch (error) {
        console.error("Not able to reach the SMP")
    }
}

async function parseInformation(ele: XmlDocument) {
    const [documentIdentifierElement] = findElements(
        ele,
        'id:DocumentIdentifier'
    );

    const [endpointReferenceElement] = findElements(
        ele,
        'wsa:Address'
    );

    const [apCertificateElement] = findElements(
        ele,
        'smp:Certificate'
    )

    const [ProcessIdentifierElement] = findElements(
        ele,
        'id:ProcessIdentifier'
    )
    const [smpCertificateElement] = findElements(
        ele,
        'X509Certificate'
    )

    const [serviceDescriptionElement] = findElements(
        ele,
        'smp:ServiceDescription'
    )

    const [technicalContactUrlElement] = findElements(
        ele,
        'smp:TechnicalContactUrl'
    )

    const apCertificateExtra = parseCertificateInformation(getText(apCertificateElement))
    const smpCertificateExtra = parseCertificateInformation(getText(smpCertificateElement))

    return {
        ProcessIdentifier: ProcessIdentifierElement
            ? {
                scheme: ProcessIdentifierElement.attributes?.scheme,
                value: getText(ProcessIdentifierElement)
            }
            : undefined,

        DocumentIdentifier: documentIdentifierElement
            ? {
                scheme: documentIdentifierElement.attributes?.scheme,
                value: getText(documentIdentifierElement)
            }
            : undefined,

        EndpointReference: endpointReferenceElement
            ? getText(endpointReferenceElement)
            : undefined,

        apCertificate: apCertificateElement
            ? {
                certificate: getText(apCertificateElement),
            serviceDescription: serviceDescriptionElement
            ? getText(serviceDescriptionElement)
            : undefined,
        
        technicalContactUrl: technicalContactUrlElement
            ? getText(technicalContactUrlElement)
            : undefined,

            ...apCertificateExtra

        }
            : undefined,


        smpCertificate: smpCertificateElement
        ? {
            certificate: getText(smpCertificateElement),
            ...smpCertificateExtra
        }
        : undefined

    };
}


function parseCertificateInformation(certificateBase64: string) {
    if (!certificateBase64) {
        console.error("No valid PEM certificate is found")
        return;
    }

    const certificatePem = [
        '-----BEGIN CERTIFICATE-----',
        certificateBase64,
        '-----END CERTIFICATE-----'
    ].join('\n');

    const x509 = new X509Certificate(certificatePem);

    return {
        subject: x509.subject,
        issuer: x509.issuer,
        validFrom: x509.validFrom,
        validTo: x509.validTo,
        serialNumber: x509.serialNumber
    };
}