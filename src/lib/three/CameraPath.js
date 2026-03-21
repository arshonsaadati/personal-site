import * as THREE from 'three'

/**
 * Defines the camera's flight path through the 3D scene using CatmullRom splines.
 * One spline for camera position, one for look-at target.
 * Progress 0.0 → 1.0 maps to Hero → Contact.
 */
export class CameraPath {
  constructor() {
    // Camera position path control points
    // The spline interpolates smoothly through these
    this.positionCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 100),     // Hero: far back, centered
      new THREE.Vector3(0, 5, 80),      // Projects: far back for text view, slightly above
      new THREE.Vector3(0, 8, 2),        // About: directly in front of text, slightly above
      new THREE.Vector3(0, 0, -80),     // Contact: deep forward
    ], false, 'catmullrom', 0.5)

    // Camera look-at target path
    this.lookAtCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),       // Hero: look at center
      new THREE.Vector3(0, 5, 0),       // Projects: look at text center
      new THREE.Vector3(0, 5, -30),     // About: look at the constellation center
      new THREE.Vector3(0, 0, -100),    // Contact: look deeper in
    ], false, 'catmullrom', 0.5)

    // Section stop points along the spline (0-1)
    this.sectionStops = [0.0, 0.33, 0.66, 1.0]

    // Reusable vectors
    this._position = new THREE.Vector3()
    this._lookAt = new THREE.Vector3()
    this._idleOffset = new THREE.Vector3()
  }

  /**
   * Get camera transform at a given progress along the path.
   * @param {number} progress - 0.0 (Hero) to 1.0 (Contact)
   * @param {number} time - elapsed time for idle animation
   * @returns {{ position: THREE.Vector3, lookAt: THREE.Vector3 }}
   */
  getTransform(progress, time = 0) {
    // Clamp progress to valid range
    const t = Math.max(0, Math.min(1, progress))

    this.positionCurve.getPoint(t, this._position)
    this.lookAtCurve.getPoint(t, this._lookAt)

    // Subtle idle sway animation
    this._idleOffset.set(
      Math.sin(time * 0.3) * 0.4,
      Math.cos(time * 0.2) * 0.3,
      Math.sin(time * 0.25) * 0.2
    )
    this._position.add(this._idleOffset)

    return {
      position: this._position,
      lookAt: this._lookAt,
    }
  }

  /**
   * Get the spline progress value for a given section index.
   */
  getSectionProgress(sectionIndex) {
    return this.sectionStops[sectionIndex] ?? 0
  }
}
