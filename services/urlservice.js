import isUrl from "is-url";
import { generate as generateUrl } from "generate-password";

import Url from "../models/urlmodel.js";

export const checkOriginalLink = (link) => {
    const check = isUrl(link);
    return check;
};

export const generateShortUrl = (length) => {
    const code = generateUrl({
        length: length,
        uppercase: true,
    });

    return code;
};

export const getOriginalLinkByUrlCode = async (user, code) => {
    try {

        // FETCHING ORIGINAL LINK BY SHORT URL CODE
        const originalLink = await Url.aggregate([
            {
                $match: {
                    "user": user._id
                }
            },
            {
                $unwind: "$urls"
            },
            {
                $match: {
                    "urls.urlCode": code
                }
            },
            {
                $project: {
                    _id: 0,
                    originalLink: "$urls.originalLink"
                }
            }
        ]);

        return originalLink[0].originalLink;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const removeShortedUrlCode = async (user, code) => {
    try {

        // FINDING AND REMOVING DATA
        const result = await Url.updateOne(
            { user: user._id },
            {
                $pull: {
                    "urls": { "urlCode": code }
                }
            }
        );

        return result ? true : false;
    } catch (error) {
        console.error(error);
    }
};
