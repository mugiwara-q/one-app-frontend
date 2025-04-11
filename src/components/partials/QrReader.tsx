import { useEffect, useRef, useState } from "react"


import { Zap, ZapOff } from "lucide-react"

// Qr Scanner
import QrScanner from "qr-scanner"
import { Button } from "@ui/button"


const QrReader = () => {
  // QR States
  const scanner = useRef<QrScanner>()
  const videoFrame = useRef<HTMLVideoElement>(null)
  const qrBoxFrame = useRef<HTMLDivElement>(null)
  const [qrOn, setQrOn] = useState<boolean>(true)
  const [iconFlash, setIconFlash] = useState<JSX.Element>(<Zap className="mr-1 h-4 w-4" />)

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("")

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result)
    setScannedResult(result?.data)
  }

  // Fail
  const onScanFail = (err: string | Error) => {
    console.log(err)
  }

  const flashListener = () => {
    scanner.current?.toggleFlash()

    if (scanner.current?.isFlashOn()) {
      setIconFlash(<ZapOff className="mr-1 h-4 w-4" />)
    }
    else {
      setIconFlash(<Zap className="mr-1 h-4 w-4" />)
    }

  }

  useEffect(() => {
    if (videoFrame?.current && !scanner.current) {
      scanner.current = new QrScanner(videoFrame?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",// "environment" =  back camera /  "user" = front camera.

        // This will help us position our "QrFrameSvg.svg" so that user can only scan when qr code is put in between our QrFrameSvg.svg.
        highlightScanRegion: true,

        // This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,

        // A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxFrame?.current || undefined,
      });

      // Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false)
        })

    }

    // Clean up on unmount.
    // This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoFrame?.current) {
        scanner?.current?.stop()
      }
    }
  }, [])

  // If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "La camera est bloquée ou n'est pas accessible. Veuillez autoriser la caméra dans les permissions de votre navigateur et recharger la page."
      );
  }, [qrOn])

  return (
    <div className="flex flex-col grid items-center justify-center mx-4">
      <div className="border-solid border-4 rounded-md border-sky-500 my-2">
        <video ref={videoFrame} className=""></video>
      </div>

      {/*
      // custom qr box frame
      <div ref={qrBoxFrame} className="">
        <img
          src={QrFrameSvg}
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>*/
      }

      <Button className="mb-5" id="flash-toggle" onClick={flashListener} > {iconFlash} FLASH</Button>

      {// SCAN RESULT
        /* scannedResult */true && (
          <div className="p-4 border-solid border-2 rounded-md">
            Resultats : {scannedResult}
            <Button variant="secondary" className="mt-5 w-full" id="flash-toggle" > Voir les détails</Button>
          </div>
        )}
    </div>
  );
};

export default QrReader