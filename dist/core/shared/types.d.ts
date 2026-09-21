/**
 * Represents a participant in the peppol network.
 * @example "0235:1234567890"
 */
export type ParticipantID = string;
export type XmlNode = {
    type: string;
    name?: string;
    attributes?: Record<string, string>;
    children?: XmlNode[];
    value?: string;
};
export type smlMode = "production" | "test";
