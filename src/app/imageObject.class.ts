export class ImageObject {
    title: string;

    /**
    * The full sized gif
    */
    fullSizedImageUrl: string;

    /**
     * The link back to the source of the location of the image
     */
    sourceUrl: string;

    tags: string[];


    /**
     * Creates an instance of ImageObject.
     *
     * @param {string} displayUrl The url to display on image listing
     */
    constructor(public displayUrl:string) {
        this.fullSizedImageUrl = this.displayUrl;
        this.sourceUrl = this.displayUrl;
    }
}