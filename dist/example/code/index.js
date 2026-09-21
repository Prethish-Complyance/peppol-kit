import { participantLookup } from "peppol-kit";
const participant = "0235:1341924489";
const result = await participantLookup(participant, "test");
console.dir(result, { depth: null });
