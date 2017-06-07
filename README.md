# Curve2D

A 2D curve system that computes intersections.

## Purpose

A balance of speed, accuracy and completeness. There are a lot of algorithms that can compute the same answers, but some use numerical methods and heuristics to do it. The goal here is implement as many analytical methods as possible and only resort to numerical methods when no way is practical.

NOTE: The API is still very much in flux.

## Supported Curves

  - Conics
    - Infinite lines
    - Circles
    - Ellipses
    - Generalized conics

### Future Support

  - Bernstein Polynomials
  - Splines
    - Bezier curves
    - B-splines

## Notes

  - Curve2D uses a `_Math` object that can be polyfilled if necessary. This object is exposed through the API.

## Usage

Unit tests contain executable documentation on how each function should be used.

## Authors

Library written by Tim Bright.

Portions of math code based on work done by authors of [THREE.js](https://github.com/mrdoob/three.js).
Attributions from specific authors done in files.

## License

Any code presented here is licensed under the MIT License.
