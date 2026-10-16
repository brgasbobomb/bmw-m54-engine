import * as THREE from 'three';

export class AnimationController {
  constructor(engineModel = null) {
    this.engineModel = engineModel;
    this.activeAnimations = new Map();
    this.animationFrameId = null;
  }

  removePart(partObject, callback) {
    if (!partObject) return;

    const startPos = partObject.position.clone();
    const startRot = partObject.rotation.clone();
    const startScale = partObject.scale.clone();
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Rotation + Slide + Fade
      partObject.rotation.x = startRot.x + Math.PI / 2 * progress;
      partObject.rotation.y = startRot.y + Math.PI / 4 * progress;

      // Slide away from center
      const direction = partObject.position.clone().normalize();
      const slideDistance = 150 * progress;
      partObject.position.copy(startPos).add(direction.multiplyScalar(slideDistance));

      // Fade out
      if (partObject.material) {
        partObject.material.opacity = 1 - progress * 0.8;
      }

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        partObject.visible = false;
        this.activeAnimations.delete(partObject);
        callback?.();
      }
    };

    this.activeAnimations.set(partObject, { startTime, duration });
    animate();
  }

  restorePart(partObject, callback) {
    if (!partObject) return;

    partObject.visible = true;
    const startPos = partObject.position.clone();
    const startRot = partObject.rotation.clone();
    const duration = 1000; // 1 second for restore
    const startTime = Date.now();

    // Store original position
    const originalData = this.getOriginalTransform(partObject);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out

      // Interpolate back to original
      partObject.position.lerpVectors(startPos, originalData.pos, easeProgress);
      partObject.rotation.x = startRot.x + (originalData.rot.x - startRot.x) * easeProgress;
      partObject.rotation.y = startRot.y + (originalData.rot.y - startRot.y) * easeProgress;

      // Fade in
      if (partObject.material) {
        partObject.material.opacity = 0.2 + progress * 0.8;
      }

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        if (partObject.material) {
          partObject.material.opacity = 1;
        }
        this.activeAnimations.delete(partObject);
        callback?.();
      }
    };

    this.activeAnimations.set(partObject, { startTime, duration });
    animate();
  }

  getOriginalTransform(partObject) {
    if (this.engineModel && partObject.userData?.partId) {
      const stored = this.engineModel.getOriginalTransform(partObject.userData.partId);
      if (stored) {
        return {
          pos: stored.position,
          rot: stored.rotation
        };
      }
    }
    return {
      pos: new window.THREE.Vector3(0, 0, 0),
      rot: { x: 0, y: 0, z: 0 }
    };
  }

  stopAnimation(partObject) {
    if (this.activeAnimations.has(partObject)) {
      cancelAnimationFrame(this.animationFrameId);
      this.activeAnimations.delete(partObject);
    }
  }

  stopAllAnimations() {
    cancelAnimationFrame(this.animationFrameId);
    this.activeAnimations.clear();
  }

  isAnimating(partObject) {
    return this.activeAnimations.has(partObject);
  }
}
