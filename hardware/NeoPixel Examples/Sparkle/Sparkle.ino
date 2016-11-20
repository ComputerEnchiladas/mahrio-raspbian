#include <Adafruit_NeoPixel.h>
#define PIN 2
#define NUM_LEDS 420
// Parameter 1 = number of pixels in strip
// Parameter 2 = pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(115200);
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
}

// *** REPLACE FROM HERE ***
void loop() {
  Sparkle(0xff, 0xff, 0xff, 0);
  Serial.write("DONE");
  delay(1000);
}

void Sparkle(byte red, byte green, byte blue, int SpeedDelay) {
  int Pixel = random(NUM_LEDS);
  setPixel(Pixel,red,green,blue);
  showStrip();
  if( Pixel < 390 ){
   setPixel(Pixel+1,red,green,blue);
   showStrip(); 
   setPixel(Pixel+2,red,green,blue);
   showStrip();
   setPixel(Pixel+3,red,green,blue);
   showStrip();
   setPixel(Pixel+4,red,green,blue);
   showStrip();
   setPixel(Pixel+5,red,green,blue);
   showStrip();
   setPixel(Pixel+6,red,green,blue);
   showStrip(); 
   setPixel(Pixel+7,red,green,blue);
   showStrip();
   setPixel(Pixel+8,red,green,blue);
   showStrip();
   setPixel(Pixel+9,red,green,blue);
   showStrip();
   setPixel(Pixel+10,red,green,blue);
   showStrip();
   setPixel(Pixel+11,red,green,blue);
   showStrip(); 
   setPixel(Pixel+12,red,green,blue);
   showStrip();
   setPixel(Pixel+13,red,green,blue);
   showStrip();
   setPixel(Pixel+14,red,green,blue);
   showStrip();
   setPixel(Pixel+15,red,green,blue);
   showStrip();
  }
  delay(SpeedDelay);
  setPixel(Pixel,0,0,0);
  setPixel(Pixel+1,0,0,0);
  setPixel(Pixel+2,0,0,0);
  setPixel(Pixel+3,0,0,0);
  setPixel(Pixel+4,0,0,0);
  setPixel(Pixel+5,0,0,0);
  setPixel(Pixel+6,0,0,0);
  setPixel(Pixel+7,0,0,0);
  setPixel(Pixel+8,0,0,0);
  setPixel(Pixel+9,0,0,0);
  setPixel(Pixel+10,0,0,0);
  setPixel(Pixel+11,0,0,0);
  setPixel(Pixel+12,0,0,0);
  setPixel(Pixel+13,0,0,0);
  setPixel(Pixel+14,0,0,0);
  setPixel(Pixel+15,0,0,0);
}
// *** REPLACE TO HERE ***

void showStrip() {
 #ifdef ADAFRUIT_NEOPIXEL_H 
   // NeoPixel
   strip.show();
 #endif
 #ifndef ADAFRUIT_NEOPIXEL_H
   // FastLED
   FastLED.show();
 #endif
}

void setPixel(int Pixel, byte red, byte green, byte blue) {
 #ifdef ADAFRUIT_NEOPIXEL_H 
   // NeoPixel
   strip.setPixelColor(Pixel, strip.Color(red, green, blue));
 #endif
 #ifndef ADAFRUIT_NEOPIXEL_H 
   // FastLED
   leds[Pixel].r = red;
   leds[Pixel].g = green;
   leds[Pixel].b = blue;
 #endif
}

void setAll(byte red, byte green, byte blue) {
  for(int i = 0; i < NUM_LEDS; i++ ) {
    setPixel(i, red, green, blue); 
  }
  showStrip();
}
