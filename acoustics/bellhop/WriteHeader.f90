SUBROUTINE WriteHeader( FileName, Title, freq0, Atten, PlotType )

  ! Write header to disk file

  USE SourceReceiverPositions
  IMPLICIT NONE
  INTEGER, PARAMETER      :: SHDFile = 25
  REAL,      INTENT( IN ) :: freq0, Atten      ! Nominal frequency, stabilizing attenuation (for wavenumber integration only)
  CHARACTER, INTENT( IN ) :: FileName*( * )    ! Name of the file (could be a shade file or a Green's function file)
  CHARACTER, INTENT( IN ) :: Title*( * )       ! Arbitrary title
  CHARACTER, INTENT( IN ) :: PlotType*( 10 )   ! 

  INTEGER LRecl

  ! receiver bearing angles
  IF ( .NOT. ALLOCATED( Pos%theta ) ) THEN
     ALLOCATE( Pos%theta( 1 ) )
     Pos%theta( 1 ) = 0   ! dummy bearing angle
     Pos%Ntheta     = 1
  END IF

  ! source x-coordinates
  IF ( .NOT. ALLOCATED( Pos%Sx ) ) THEN
     ALLOCATE( Pos%Sx( 1 ) )
     Pos%sx( 1 ) = 0   ! dummy x-coordinate
     Pos%NSx     = 1
  END IF

  ! source y-coordinates
  IF ( .NOT. ALLOCATED( Pos%Sy ) ) THEN
     ALLOCATE( Pos%Sy( 1 ) )
     Pos%sy( 1 ) = 0   ! dummy y-coordinate
     Pos%NSy     = 1
  END IF

  IF ( PlotType( 1 : 2 ) /= 'TL' ) THEN
     ! MAX( 41, ... ) below because Title is already 40 words (or 80 bytes)
     LRecl = MAX( 41, 2 * Nfreq, Pos%Ntheta, Pos%NSx, Pos%NSy, Pos%NSz, Pos%NRz, 2 * Pos%NRr )   ! words/record (NRr doubled for complex pressure storage)

     OPEN ( FILE = FileName, UNIT = SHDFile, STATUS = 'REPLACE', ACCESS = 'DIRECT', RECL = 4 * LRecl, FORM = 'UNFORMATTED')
     WRITE( SHDFile, REC = 1  ) LRecl, Title( 1 : 80 )
     WRITE( SHDFile, REC = 2  ) PlotType
     WRITE( SHDFile, REC = 3  ) Nfreq, Pos%Ntheta, Pos%NSx, Pos%NSy, Pos%NSz, Pos%NRz, Pos%NRr, freq0, atten
     WRITE( SHDFile, REC = 4  ) freqVec(   1 : Nfreq )
     WRITE( SHDFile, REC = 5  ) Pos%theta( 1 : Pos%Ntheta )

     WRITE( SHDFile, REC = 6  ) Pos%Sx( 1 : Pos%NSx )
     WRITE( SHDFile, REC = 7  ) Pos%Sy( 1 : Pos%NSy )
     WRITE( SHDFile, REC = 8  ) Pos%Sz( 1 : Pos%NSz )

     WRITE( SHDFile, REC = 9  ) Pos%Rz( 1 : Pos%NRz )
     WRITE( SHDFile, REC = 10 ) Pos%Rr( 1 : Pos%NRr )
  ELSE   ! compressed format for TL from FIELD3D
     LRecl = MAX( 41, 2 * Nfreq, Pos%Ntheta, Pos%NSz, Pos%NRz, 2 * Pos%NRr )   ! words/record (NR doubled for complex pressure storage)

     OPEN ( FILE = FileName, UNIT = SHDFile, STATUS = 'REPLACE', ACCESS = 'DIRECT', RECL = 4 * LRecl, FORM = 'UNFORMATTED')
     WRITE( SHDFile, REC = 1  ) LRecl, Title( 1 : 80 )
     WRITE( SHDFile, REC = 2  ) PlotType
     WRITE( SHDFile, REC = 3  ) Nfreq, Pos%Ntheta, Pos%NSx, Pos%NSy, Pos%NSz, Pos%NRz, Pos%NRr, freq0, atten
     WRITE( SHDFile, REC = 4  ) freqVec(   1 : Nfreq )
     WRITE( SHDFile, REC = 5  ) Pos%theta( 1 : Pos%Ntheta )

     WRITE( SHDFile, REC = 6  ) Pos%Sx( 1 ), Pos%Sx( Pos%NSx )
     WRITE( SHDFile, REC = 7  ) Pos%Sy( 1 ), Pos%Sy( Pos%NSy )
     WRITE( SHDFile, REC = 8  ) Pos%Sz( 1 : Pos%NSz )

     WRITE( SHDFile, REC = 9  ) Pos%Rz( 1 : Pos%NRz )
     WRITE( SHDFile, REC = 10 ) Pos%Rr( 1 : Pos%NRr )
  END IF

END SUBROUTINE WriteHeader

!**********************************************************************!

SUBROUTINE WriteField( P, NRz, NRr, IRec )

  ! Write the field to disk

  IMPLICIT NONE
  INTEGER, PARAMETER       :: SHDFile = 25
  INTEGER, INTENT( IN )    :: NRz, NRr        ! Number of receiver depths, ranges
  COMPLEX, INTENT( IN )    :: P( NRz, NRr )   ! Pressure field
  INTEGER, INTENT( INOUT ) :: IRec            ! last record read
  INTEGER                  :: irz

  DO irz = 1, NRz
     IRec = IRec + 1
     WRITE( SHDFile, REC = IRec ) P( irz, : )
  END DO

END SUBROUTINE WriteField
