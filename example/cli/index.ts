import { participantLookup } from "peppol-kit";

async function main() {
    const participantID = process.argv[2];
    const sml = process.argv[3] ?? "test";

    if (!participantID) {
        console.error(
            "Usage: node index.js <participant-id> [test|production]"
        );
        process.exit(1);
    }

    if (sml !== "test" && sml !== "production") {
        console.error("SML must be either 'test' or 'production'");
        process.exit(1);
    }

    try {
        const result = await participantLookup(
            participantID,
            sml
        );

        console.log(result);
    } catch (error) {
        console.error(
            error instanceof Error ? error.message : error
        );
        process.exit(1);
    }
}

main();