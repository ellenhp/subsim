
EXECUTABLES = bellhop.exe
FC = gfortran -ffast-math


BELLHOP_OBJECTS   = angleMod.o ArrMod.o bdryMod.o   bellhopMod.o sspMod.o ReflectMod.o                       WriteRay.o              influence.o                           ReadEnvironmentBell.o bellhop.o libmisc.a
BELLHOP_LIBS = -Lmisc

all: $(EXECUTABLES)
	@echo "Bellhop built"
	@echo "*************"
	@echo " "

clean:
	-rm -f *.o *.mod *.exe *_genmod.f90

# Declare implicit rules (for make utilities with missing or broken build rules)

.SUFFIXES: .a .o .mod .f .f90

.f.o:
	$(FC) -c $(FFLAGS) $< 

.f90.o:
	$(FC) -c $(FFLAGS) $< 

.f90.mod:
	$(FC) -c $(FFLAGS) $< 

# Declare explicit dependencies (and explicit build rules as needed)

bellhop.exe: $(BELLHOP_OBJECTS)
	$(FC) -o $@ $(FFLAGS) $(BELLHOP_OBJECTS) $(BELLHOP_LIBS)

angleMod.o anglemod.mod: angleMod.f90 libmisc.a
	$(FC) -c $(FFLAGS) $< 

ArrMod.o arrmod.mod: ArrMod.f90 libmisc.a
	$(FC) -c $(FFLAGS) $< 

bdryMod.o bdrymod.mod: bdryMod.f90 libmisc.a
	$(FC) -c $(FFLAGS) $< 

bellhopMod.o bellhopmod.mod: bellhopMod.f90 libmisc.a
	$(FC) -c $(FFLAGS) $< 

Cone.o cone.mod: Cone.f90 libmisc.a
	$(FC) -c $(FFLAGS) $<

influence.o influence.mod: influence.f90 libmisc.a
	$(FC) -c $(FFLAGS) $< 

RayNormals.o raynormals.mod: RayNormals.f90 libmisc.a
	$(FC) -c $(FFLAGS) $<

ReadEnvironmentBell.o readenvironmentbell.mod: ReadEnvironmentBell.f90 libmisc.a
	$(FC) -c $(FFLAGS) $< 

ReflectMod.o   reflectmod.mod:   ReflectMod.f90   Cone.o libmisc.a
	$(FC) -c $(FFLAGS) $<

sspMod.o sspmod.mod: sspMod.f90 libmisc.a
	$(FC) -c $(FFLAGS) $< 

WriteRay.o writeray.mod: WriteRay.f90 libmisc.a
	$(FC) -c $(FFLAGS) $<

bellhop.o:   arrmod.mod anglemod.mod bdrymod.mod   readenvironmentbell.mod bellhopmod.mod sspmod.mod reflectmod.mod                  writeray.mod raynormals.mod influence.mod                 bellhop.f90


########################################## MISC BELOW ##########################################

AR = ar

# Intel compiler needed the following definition for the archiver:
#AR = xiar

ARFLAGS = r

RANLIB = ranlib

# include norm2.o below, if your compiler is missing that intrinsic
OBJECTS_MISC = ReadHeader.o beampattern.o MathConstants.o RefCoef.o SourceReceiverPositions.o  pchipMod.o AttenMod.o sspMod_misc.o WriteHeader.o errout.o interpolation.o MergeVectors.o munk.o ReadEnvironmentMod.o SortMod.o splinec.o subtabulate.o twersky.o calculateweights.o xerror.o norms.o cross_products.o monotonicMod.o PolyMod.o PekerisRoot.o

# Declare implicit rules (for make utilities with missing or broken build rules)

.SUFFIXES: .a .o .mod .f .f90

# Declare explicit dependencies (and explicit build rules as needed)

libmisc.a: $(OBJECTS_MISC)
	$(AR) $(ARFLAGS) $@ $(OBJECTS_MISC)
	$(RANLIB) $@
	@echo "Routines needed by SCOOTER\SPARC\BELLHOP\BOUNCE built"

subtabultate.o subtabulate.mod: subtabulate.f90
	$(FC) -c $(FFLAGS) $<

calculateweights.o calculateweights.mod: calculateweights.f90
	$(FC) -c $(FFLAGS) $<

SourceReceiverPositions.o sourcereceiverpositions.mod: SourceReceiverPositions.f90 monotonicmod.mod sortmod.mod subtabulate.mod
	$(FC) -c $(FFLAGS) $< 

ReadHeader.o: sourcereceiverpositions.mod ReadHeader.f90

PolyMod.o polymod.mod: PolyMod.f90
	$(FC) -c $(FFLAGS) $< 

AttenMod.o: AttenMod.f90 MathConstants.mod
	$(FC) -c $(FFLAGS) $<

beampattern.o beampattern.mod: beampattern.f90
	$(FC) -c $(FFLAGS) $<

interpolation.o interpolation.mod: interpolation.f90
	$(FC) -c $(FFLAGS) $<

MathConstants.o mathconstants.mod: MathConstants.f90
	$(FC) -c $(FFLAGS) $< 

RefCoef.o refcoef.mod: RefCoef.f90 polymod.mod
	$(FC) -c $(FFLAGS) $< 

sspMod_misc.o sspmod_misc.mod: sspMod_misc.f90 pchipmod.mod attenmod.mod
	$(FC) -c $(FFLAGS) $< 

pchipMod.o pchipmod.mod: pchipMod.f90
	$(FC) -c $(FFLAGS) $< 

monotonicMod.o monotonicmod.mod: monotonicMod.f90
	$(FC) -c $(FFLAGS) $< 

SortMod.o sortmod.mod: SortMod.f90
	$(FC) -c $(FFLAGS) $< 

PekerisRoot.o: PekerisRoot.f90

WriteHeader.o: WriteHeader.f90 sourcereceiverpositions.mod
errout.o: errout.f90
MergeVectors.o: MergeVectors.f90
munk.o: munk.f90
norms.o norms.mod: norms.f90
	$(FC) -c $(FFLAGS) $< 
