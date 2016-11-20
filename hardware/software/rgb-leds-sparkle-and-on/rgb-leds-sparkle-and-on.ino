#include <Adafruit_NeoPixel.h>
#define PIN 2
#define NUM_LEDS 420
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);
String mode = "0";
int r, g, b;

String incomingCommand = "";

void setup() {
  Serial.begin(115200);
  strip.begin();
  setAll(0x00,0x00,0x00);
}

void loop() {
  if( Serial.available() > 0 ) {
    incomingCommand = Serial.readStringUntil('\n');
    mode = incomingCommand.substring(0, 1);
  
    b = hexToDec( incomingCommand.substring(5,7) );
    g = hexToDec( incomingCommand.substring(3,5) );
    r = hexToDec( incomingCommand.substring(1,3) );
  
    if( mode == "0" ) {
      setAll(r, g, b);  
    } else {
      setAll(0x00,0x00,0x00);
    }
    return;
  }
  if( mode == "1" ) {
    Sparkle(r, g, b, 15); 
  }
}
void Sparkle(byte red, byte green, byte blue, int SpeedDelay) {
  int Pixel = random(NUM_LEDS);
  setPixel(Pixel,red,green,blue);
  showStrip();
  delay(SpeedDelay);
  setPixel(Pixel, 0, 0, 0);
}
int hexToDec(String hexString) {
  int decValue = 0, nextInt;
  
  for (int i = 0; i < hexString.length(); i++) {
    nextInt = int( hexString.charAt(i) );
    if (nextInt >= 48 && nextInt <= 57) nextInt = map(nextInt, 48, 57, 0, 9);
    if (nextInt >= 65 && nextInt <= 70) nextInt = map(nextInt, 65, 70, 10, 15);
    if (nextInt >= 97 && nextInt <= 102) nextInt = map(nextInt, 97, 102, 10, 15);
    nextInt = constrain(nextInt, 0, 15);
    
    decValue = (decValue * 16) + nextInt;
  }
  
  return decValue;
}
void showStrip() {
 strip.show();
}
void setPixel(int Pixel, byte red, byte green, byte blue) {
 strip.setPixelColor(Pixel, strip.Color(red, green, blue));
}
void setAll(byte red, byte green, byte blue) {
  for(int i = 0; i < NUM_LEDS; i++ ) {
    setPixel(i, red, green, blue); 
  }
  showStrip();
}