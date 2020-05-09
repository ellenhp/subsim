MODULE ReadEnvironmentMod

  ! mbp 12/2018, based on much older subroutine

  USE sspMod
  IMPLICIT NONE

CONTAINS
  SUBROUTINE ReadEnvironment( FileRoot, Title, freq0, MaxMedium, TopOpt, NG, BotOpt, ENVFile, PRTFile )

    ! Reads in the info in ENVFile

!!! FIXME: MaxMedium and MaxMedia are essentially the same thing
!!! variables associated with them are used in Krakenmod and sspMod

    USE SubTabulate

    INTEGER,             INTENT( IN  ) :: ENVFile, PRTFile, MaxMedium
    INTEGER,             INTENT( OUT ) :: NG( * )
    REAL       (KIND=8), INTENT( OUT ) :: freq0
    CHARACTER ( LEN=* ), INTENT( IN  ) :: FileRoot
    CHARACTER,           INTENT( OUT ) :: TopOpt*( * ), BotOpt*( * ), Title*( * )
    INTEGER             :: NElts, Medium, Nneeded, iostat
    REAL       (KIND=8) :: rho( MaxSSP ), c, deltaz
    COMPLEX    (KIND=8) :: cP( MaxSSP ), cS( MaxSSP )
    CHARACTER ( LEN=2 ) :: AttenUnit
    CHARACTER ( LEN=8 ) :: Task

    ! Open the print file
    OPEN( UNIT = PRTFile, FILE = TRIM( FileRoot ) // '.prt', STATUS = 'UNKNOWN', IOSTAT = iostat )

    ! Open the environmental file
    OPEN( UNIT = ENVFile, FILE = TRIM( FileRoot ) // '.env', STATUS = 'OLD',     IOSTAT = iostat, ACTION = 'READ' )

    IF ( IOSTAT /= 0 ) THEN   ! successful open?
       WRITE( PRTFile, * ) 'ENVFile = ', TRIM( FileRoot ) // '.env'
       CALL ERROUT( PrtFile, 'F', 'READIN', 'Unable to open the environmental file' )
    END IF

    ! set default values for the ssp (in case this is the nth profile after one has already been read)
    alphaR = 1500
    betaR  = 0
    alphaI = 0
    betaI  = 0
    rhoR   = 1

    NElts  = 0         ! this is a dummy variable, passed to profil during read of SSP

    WRITE( PRTFile, * ) '_________________________________________________'
    WRITE( PRTFile, * )
    READ(  ENVFile, *, END = 9999 ) Title( 9 : 80 )
    WRITE( PRTFile, * ) Title

    READ(  ENVFile, *, END = 9999  ) freq0
    WRITE( PRTFile, "( ' Nominal Frequency = ', G11.4, 'Hz' )" ) freq0

    READ(  ENVFile, *, END = 9999  ) SSP%NMedia
    WRITE( PRTFile, "( ' NMedia    = ', I3,         / )" ) SSP%NMedia

    IF ( SSP%NMedia > MaxMedium ) THEN
       WRITE( PRTFile, * ) 'MaxMedia = ', MaxMedium
       CALL ERROUT( PRTFile, 'F', 'READIN', 'Too many Media' )
    ENDIF

    CALL ReadTopOpt( TopOpt, HSTop%BC, AttenUnit )

    ! *** Top BC ***

    IF ( HSTop%BC == 'A' ) WRITE( PRTFile, "( //, '   z (m)     alphaR (m/s)   betaR  rho (g/cm^3)  alphaI     betaI', / )" )
    CALL TopBot( ENVFile, PRTFile, HSTop )

    !  *** Internal media *** 
    IF ( HSTop%BC /= 'A' ) WRITE( PRTFile, "( //, '   z (m)     alphaR (m/s)   betaR  rho (g/cm^3)  alphaI     betaI', / )" )

    MediumLoop: DO Medium = 1, SSP%NMedia
       IF ( AttenUnit( 1 : 1 ) == 'm' ) THEN   ! this particular attenuation unit needs to get a power law and transition frequency
          READ(  ENVFile, *, END = 9999 ) NG( Medium ), SSP%sigma( Medium ), &
               SSP%Depth( Medium + 1 ), SSP%beta( Medium ), SSP%fT( Medium )
          WRITE( PRTFile, "( /, '  ( # mesh pts = ', I5, '  RMS roughness = ', G10.3, ' beta = ', G10.3, ' fT = ', G11.4, ' )')" ) &
               NG( Medium ), SSP%sigma( Medium ), SSP%beta( Medium ), SSP%fT( Medium )

       ELSE
          READ(  ENVFile, *, END = 9999 ) NG( Medium ), SSP%sigma( Medium ), SSP%Depth( Medium + 1 )
          WRITE( PRTFile, "( /, '       ( # mesh points = ', I5, '  RMS roughness = ', G10.3, ' m', ' )')" ) &
               NG( Medium ), SSP%sigma( Medium )
       END IF

       IF ( ( ( 25 * freq0 / 1500 ) * SSP%sigma( Medium ) ) ** 2 > 1 ) &
            CALL ERROUT( PRTFile, 'W', 'READIN', &
            'The Rayleigh roughness parameter might exceed the region of validity for the scatter approximation' )

       !  Call EvaluateSSP to read in SSP 
       Task = 'INIT'
       CALL EvaluateSSP( cP, cS, rho, Medium, NElts, freq0, Task, ENVFile, PRTFile  )

       ! estimate number of points needed (can be a bad estimate if the layer has a big change in sound speed)
       c = alphar   ! this is the last sound speed value that was read
       IF ( betar > 0.0 ) c = betar     ! shear?
       deltaz  = c / freq0 / 20          ! default sampling: 20 points per wavelength
       Nneeded = INT( ( SSP%Depth( Medium + 1 ) - SSP%Depth( Medium ) ) / deltaz )
       Nneeded = MAX( Nneeded, 10 )     ! require a minimum of 10 points

       IF ( NG( Medium ) == 0 ) THEN    ! automatic calculation of f.d. mesh
          NG( Medium ) = Nneeded
          WRITE( PRTFile, * ) '       ( Number mesh points auto calc. = ', NG( Medium ), ' )'
       ELSE IF ( NG( Medium ) < Nneeded / 2 ) THEN
          WRITE( PRTFILE, * ) 'Number of mesh points needed = ', Nneeded
          CALL ERROUT( PRTFile, 'F', 'ReadEnvironment', 'Mesh is too coarse' )
       END IF

    END DO MediumLoop

    ! *** Bottom properties ***

    WRITE( PRTFile, * )
    IF ( AttenUnit( 1 : 1 ) == 'm' ) THEN   ! this particular attenuation unit needs to get a power law and transition frequency
       READ( ENVFile, *, END = 9999 ) BotOpt( 1 : 8 ), SSP%sigma( SSP%NMedia + 1 ), HSBot%beta, HSBot%fT
       WRITE( PRTFile, "( 22X, '( RMS roughness = ', G10.3,' beta = ', G10.3, ' fT = ', G10.3, ' )' )" ) &
            SSP%sigma( SSP%NMedia + 1 ), HSBot%beta, HSBot%fT
    ELSE
       READ( ENVFile, *, END = 9999 ) BotOpt( 1 : 8 ), SSP%sigma( SSP%NMedia + 1 )
       WRITE( PRTFile, "( 30X, '( RMS roughness = ', G10.3, ' m', ' )' )" ) SSP%sigma( SSP%NMedia + 1 )
    END IF

    HSBot%BC = BotOpt( 1 : 1 )

    ! Read bottom BC 
    CALL TopBot( ENVFile, PRTFile, HSBot )

    RETURN

9999 WRITE( PRTFile, * ) 'End of environmental file'

    CLOSE( ENVFile )
    STOP

  END SUBROUTINE ReadEnvironment

  !**********************************************************************!

  SUBROUTINE ReadTopOpt( TopOpt, BC, AttenUnit )

    USE AttenMod
    INTEGER, PARAMETER :: ENVFile = 5, PRTFile = 6, SSPFile = 40
    CHARACTER (LEN= 8), INTENT( OUT ) :: TopOpt
    CHARACTER (LEN= 1), INTENT( OUT ) :: BC                     ! Boundary condition type
    CHARACTER (LEN= 2), INTENT( OUT ) :: AttenUnit

    TopOpt = '      '   ! initialize to blanks
    READ( ENVFile, * ) TopOpt
    WRITE( PRTFile, * )

    SSP%Type      = TopOpt( 1 : 1 )
    BC            = TopOpt( 2 : 2 )
    AttenUnit     = TopOpt( 3 : 4 )
    SSP%AttenUnit = AttenUnit

    ! SSP approximation options

    SELECT CASE ( SSP%Type )
    CASE ( 'N' )
       WRITE( PRTFile, * ) '    N2-Linear approximation to SSP'
    CASE ( 'C' )
       WRITE( PRTFile, * ) '    C-Linear approximation to SSP'
    CASE ( 'P' )
       WRITE( PRTFile, * ) '    PCHIP approximation to SSP'
    CASE ( 'S' )
       WRITE( PRTFile, * ) '    Spline approximation to SSP'
    CASE ( 'A' )
       WRITE( PRTFile, * ) '    Analytic SSP option'
    CASE DEFAULT
       CALL ERROUT( PRTFile, 'F', 'READIN', 'Unknown option for SSP approximation' )
    END SELECT

    ! Attenuation options

    SELECT CASE ( AttenUnit( 1 : 1 ) )
    CASE ( 'N' )
       WRITE( PRTFile, * ) '    Attenuation units: nepers/m'
    CASE ( 'F' )
       WRITE( PRTFile, * ) '    Attenuation units: dB/mkHz'
    CASE ( 'M' ) 
       WRITE( PRTFile, * ) '    Attenuation units: dB/m'
    CASE ( 'm' ) 
       WRITE( PRTFile, * ) '    Attenuation units: dB/m with a power law and transition frequency'
    CASE ( 'W' )
       WRITE( PRTFile, * ) '    Attenuation units: dB/wavelength'
    CASE ( 'Q' )
       WRITE( PRTFile, * ) '    Attenuation units: Q'
    CASE ( 'L' )
       WRITE( PRTFile, * ) '    Attenuation units: Loss parameter'
    CASE DEFAULT
       CALL ERROUT( PRTFile, 'F', 'READIN', 'Unknown attenuation units' )
    END SELECT

    !  Added volume attenuation

    SELECT CASE ( AttenUnit( 2 : 2 ) )
    CASE ( 'T' )
       WRITE( PRTFile, * ) '    THORP volume attenuation added'
    CASE ( 'F' )
       WRITE( PRTFile, * ) '    Francois-Garrison volume attenuation added'
       READ(  ENVFile, * ) T, Salinity, pH, z_bar
       WRITE( PRTFile, "( 7x, ' T = ', F4.1, ' degrees   S = ', F4.1, ' psu   pH = ', F4.1, '   z_bar = ', F6.1, ' m' )" ) &
            T, Salinity, pH, z_bar
    CASE ( 'B' )
       WRITE( PRTFile, * ) '    Biological attenuation'
       READ( ENVFile, *  ) NBioLayers
       WRITE( PRTFile, * ) '      Number of Bio Layers = ', NBioLayers
       IF ( NBioLayers > MaxBioLayers ) THEN
          CALL ERROUT( PRTFile, 'F', 'READIN', 'Too many biolayers' )
          WRITE( PRTFile, * ) 'MaxBioLayers = ', MaxBioLayers
       END IF

       DO iBio = 1, NBioLayers
          READ( ENVFile, *  ) bio( iBio )%Z1, bio( iBio )%Z2, bio( iBio )%f0, bio( iBio )%Q, bio( iBio )%a0
          WRITE( PRTFile, * )
          WRITE( PRTFile, "( '       Top    of layer     = ', G11.4,' m'  )" ) bio( iBio )%Z1
          WRITE( PRTFile, "( '       Bottom of layer     = ', G11.4,' m'  )" ) bio( iBio )%Z2
          WRITE( PRTFile, "( '       Resonance frequency = ', G11.4,' Hz' )" ) bio( iBio )%f0
          WRITE( PRTFile, "( '       Q                   = ', G11.4       )" ) bio( iBio )%Q
          WRITE( PRTFile, "( '       a0                  = ', G11.4       )" ) bio( iBio )%a0
       END DO
    CASE ( ' ' )
    CASE DEFAULT
       CALL ERROUT( PRTFile, 'F', 'ReadTopOpt', 'Unknown top option letter in fourth position' )
    END SELECT

  END SUBROUTINE ReadTopOpt

  !**********************************************************************!
  SUBROUTINE TopBot( ENVFile, PRTFile, HS )

    ! Handles top and bottom boundary conditions

    ! Input:
    !     ENVFile: Environmental file
    !     PRTFile: Print file
    !     freq0:   Nominal or Carrier Frequency
    !     HS%BC:   Boundary condition type
    !
    ! Output:
    !    HS%cP:    P-wave speed in halfspace
    !    HS%cS:    S-wave speed in halfspace
    !    HS%rho:   density in halfspace

    !    BumpDensity: Bump density
    !    eta:         Principal radius 1
    !    xi:          Principal radius 2

    INTEGER,        INTENT( IN    ) :: ENVFile, PRTFile
    TYPE( HSInfo ), INTENT( INOUT ) :: HS
    REAL     (KIND=8) :: zTemp

    ! Echo to PRTFile user's choice of boundary condition 
    SELECT CASE ( HS%BC )
    CASE ( 'S' )
       WRITE( PRTFile, * ) '    Twersky SOFT BOSS scatter model'
    CASE ( 'H' )
       WRITE( PRTFile, * ) '    Twersky HARD BOSS scatter model'
    CASE ( 'T' )
       WRITE( PRTFile, * ) '    Twersky (amplitude only) SOFT BOSS scatter model'
    CASE ( 'I' )
       WRITE( PRTFile, * ) '    Twersky (amplitude only) HARD BOSS scatter model'
    CASE ( 'V' )
       WRITE( PRTFile, * ) '    VACUUM'
    CASE ( 'R' )
       WRITE( PRTFile, * ) '    Perfectly RIGID'
    CASE ( 'A' )
       WRITE( PRTFile, * ) '    ACOUSTO-ELASTIC half-space'
    CASE ( 'F' )
       WRITE( PRTFile, * ) '    FILE used for reflection loss'
    CASE ( 'W' )
       WRITE( PRTFile, * ) '    Writing an IRC file'
    CASE ( 'P' )
       WRITE( PRTFile, * ) '    reading PRECALCULATED IRC'
    CASE DEFAULT
       CALL ERROUT( PRTFile, 'F', 'TopBot', 'Unknown boundary condition type' )
    END SELECT

    ! Read in BC parameters depending on particular choice 
    HS%cP  = 0.0
    HS%cS  = 0.0
    HS%rho = 0.0

    SELECT CASE ( HS%BC )
    CASE ( 'S', 'H', 'T', 'I' )    ! Twersky ice model parameters 
       READ(  ENVFile, *    ) HS%BumpDensity, HS%eta, HS%xi
       WRITE( PRTFile, 1000 ) HS%BumpDensity, HS%eta, HS%xi
1000   FORMAT( /, ' Twersky ice model parameters:', /, ' Bump Density = ', G15.6, '  Eta = ', G11.3, '  Xi = ', G11.3, / )
    CASE ( 'A' )                   !  Half-space properties
       zTemp = 0.0
       READ(  ENVFile, *    ) zTemp, alphaR, betaR, rhoR, alphaI, betaI
       WRITE( PRTFile, FMT="( F10.2, 3X, 2F10.2, 3X, F6.2, 3X, 2F10.4 )" ) zTemp, alphaR, betaR, rhoR, alphaI, betaI
       HS%alphaR = alphaR
       HS%alphaI = alphaI
       HS%rho    = rhoR
       HS%betaR  = betaR
       HS%betaI  = betaI
       IF ( alphaR == 0.0 .OR. rhoR == 0.0 ) &
            CALL ERROUT( PRTFile, 'F', 'TopBot', 'Sound speed or density vanishes in halfspace' )
    END SELECT

    RETURN
  END SUBROUTINE TopBot
END MODULE ReadEnvironmentMod
