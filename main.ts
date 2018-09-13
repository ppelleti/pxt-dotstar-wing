/**
 * Well known colors.
 */
enum DotStarWingColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}

/**
 * DotStar FeatherWing used with feather:bit.
 */
//% color="#ffff00" weight=50 icon="\uf0eb" block="DotStar Wing"
namespace dotstarwing {
    const COLS: number = 12
    const ROWS: number = 6

    /**
     * Converts red, green, blue channels into an RGB color
     * @param red value of the red channel between 0 and 255. eg: 255
     * @param green value of the green channel between 0 and 255. eg: 255
     * @param blue value of the blue channel between 0 and 255. eg: 255
     */
    //% weight=1
    //% blockId="dotstarwing_rgb" block="red %red|green %green|blue %blue"
    //% advanced=true
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Gets the RGB value of a known color
    */
    //% weight=2 blockGap=8
    //% blockId="dotstarwing_colors" block="%color"
    //% advanced=true
    export function colors(color: DotStarWingColors): number {
        return color;
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    /**
     * Converts a hue saturation luminosity value into a RGB color
     * @param h hue from 0 to 360
     * @param s saturation from 0 to 99
     * @param l luminosity from 0 to 99
     */
    //% blockId=dotstarwing_hsl block="hue %h|saturation %s|luminosity %l"
    export function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
        let h1 = Math.idiv(h, 60);//[0,6]
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;
        return packRGB(r, g, b);
    }

    /**
     * Scroll text across DotStar Wing
     * @param text - text to scroll
     * @param brightness - brightness to set (0-255)
     * @param delay - additional delay in milliseconds (0-100)
     */
    //% blockId=dotstarwing_scroll_text
    //% block="scroll %text| at brightness %brightness| with delay (ms) %delay"
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    //% delay.min=0 delay.max=100 delay.defl=50
    export function scrollText(text: string,
                               brightness: number = 128,
                               delay: number = 50) {
    }

    function setImage(image: Image,
                      col: number,
                      row: number,
                      brightness: number = 128): void {
    }

    /**
     * Set a single pixel on DotStar Wing
     * @param col - column to set (0-16)
     * @param row - row to set (0-6)
     * @param brightness - brightness to set (0-255)
     */
    //% blockId=dotstarwing_set_pixel
    //% block="set pixel| at col %col| row %row| to %brightness"
    //% col.min=0 col.max=16
    //% row.min=0 row.max=6
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    export function setPixel(col: number,
                             row: number,
                             brightness: number = 128): void {
    }

    /**
     * Update DotStar Wing,
     * update the display with your pretty pixels
     */
    //% blockId=dotstarwing_show
    //% block="display your changes"
    export function show(): void {
        let corrected_buf: Buffer = pins.createBuffer(144)

        for (let x = 0; x < buf.length; x++) {
            corrected_buf[x] = GAMMA[buf[x]]
        }

        smbus.writeByte(I2C_ADDR, REG_BANK, frame)
        smbus.writeBuffer(I2C_ADDR, REG_COLOR, corrected_buf)
        smbus.writeByte(I2C_ADDR, REG_BANK, BANK_CONFIG)
        smbus.writeByte(I2C_ADDR, REG_FRAME, frame)

        frame = frame == 0 ? 1 : 0
    }

    /**
     * Return the width (number of cols) of DotStar Wing
     */
    //% blockId=dotstarwing_cols
    //% block="number of columns"
    //% color=#444444
    //% icon=""
    export function cols(): number {
        return COLS
    }

    /**
     * Return the height (number of rows) of DotStar Wing
     */
    //% blockId=dotstarwing_rows
    //% block="number of rows"
    //% color=#444444
    //% icon=""
    export function rows(): number {
        return ROWS
    }

    /**
     * Get a single pixel on DotStar Wing,
     * returns a brightness value (0-255)
     * @param col - column to get (0-16)
     * @param row - row to get (0-6)
     */
    //% blockId=dotstarwing_get_pixel icon="\uf0eb"
    //% block="get pixel| at col %col| row %row"
    //% advanced color=#554444
    export function getPixel(col: number, row: number): number {
    }
}
